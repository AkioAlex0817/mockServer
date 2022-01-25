const {
  ERROR_TX_INVALID_INPUT_UNKNOWN,
  ERROR_DB_DUPLICATED,
  ERROR_DB_UNKNOWN,
  ERROR_DB_CONNECTION_FAILED,
  ERROR_DB_ALREADY_DONE,
  ERROR_DB_PROCESSING,
  addErrorMessage,
} = require('../services/errors');
const serviceEVM = require('../services/ether');
const serviceSolana = require('../services/solana');
const serviceDb = require('../services/db');
const serviceShared = require('../services/shared');
const logger = require('../services/winston');

async function redeem(req, res) {
  const { schid: from_chain_id, txid: txId } = req.query;
  logger.debug(JSON.stringify(req.query));
  let result = await _redeem(parseInt(from_chain_id), txId);
  res.json(addErrorMessage(result));
}
async function _redeem(from_chain_id, tx_id) {
  let result;

  logger.info('Starting redeem validation');
  try {
    if (serviceEVM.isEVMChain(from_chain_id)) {
      result = await serviceEVM.validateHashTransaction(from_chain_id, tx_id);
    } else {
      result = await serviceSolana.validateHashTransaction(
        from_chain_id,
        tx_id
      );
    }
    if (!result.success) {
      return result;
    }
  } catch (e) {
    logger.error(e);
    return { success: false, error_code: ERROR_TX_INVALID_INPUT_UNKNOWN };
  }
  logger.info('Finished redeem validation');

  logger.info('Starting database transaction');
  const { amount, from_address, to_chain_id, to_address } = result;
  let supabase = null;
  try {
    supabase = serviceDb.getSupabase();
    let result = await serviceDb.fetchTransfer(supabase, tx_id);
    logger.debug(JSON.stringify(result));

    if (!result.error && result.status === 200 && result.data) {
      if (
        result.data.status !== serviceDb.TRANSFER_STATUS_FAILED_REDEEM &&
        result.data.status !== serviceDb.TRANSFER_STATUS_FAILED_SEND
      ) {
        if (
          result.data.status === serviceDb.TRANSFER_STATUS_SENDING ||
          result.data.status === serviceDb.TRANSFER_STATUS_REDEEMING
        ) {
          return { success: false, error_code: ERROR_DB_PROCESSING };
        } else {
          return { success: false, error_code: ERROR_DB_ALREADY_DONE };
        }
      }
    } else if (result.error && result.status === 406) {
      let result = await serviceDb.insertTransfer(
        supabase,
        from_chain_id,
        from_address,
        tx_id,
        to_chain_id,
        to_address,
        amount,
        'hash',
        serviceDb.TRANSFER_STATUS_REDEEMING
      );
      logger.debug(JSON.stringify(result));

      if (result.error || result.status !== 201) {
        if (result.statusText === 'Conflict') {
          return { success: false, error_code: ERROR_DB_DUPLICATED };
        } else {
          return { success: false, error_code: ERROR_DB_UNKNOWN };
        }
      }
    }

    // Don't allow for multiple redemption requests
    let resultRecovery = await serviceDb.insertRecovery(
      supabase,
      tx_id,
      serviceDb.TRANSFER_STATUS_REDEEMING
    );
    logger.debug(JSON.stringify(resultRecovery));
    if (resultRecovery.error || resultRecovery.status !== 201) {
      if (resultRecovery.statusText === 'Conflict') {
        return { success: false, error_code: ERROR_DB_DUPLICATED };
      } else {
        return { success: false, error_code: ERROR_DB_UNKNOWN };
      }
    }
  } catch (e) {
    logger.error(e);
    return { success: false, error_code: ERROR_DB_CONNECTION_FAILED };
  }
  logger.info('Finished database transaction');

  logger.info(`Starting transfer`);
  const { result_tx_id, error_code } = await serviceShared.transfer(
    to_chain_id,
    to_address,
    amount
  );
  logger.debug(`error_code: ${error_code}, result_tx_id: ${result_tx_id}`);
  logger.info('Finished transfer');

  if (error_code > 0) {
    await serviceDb.updateTransfer(
      supabase,
      tx_id,
      serviceDb.TRANSFER_STATUS_FAILED_REDEEM,
      error_code,
      result_tx_id
    );
    await serviceDb.updateRecovery(
      supabase,
      tx_id,
      serviceDb.TRANSFER_STATUS_FAILED_REDEEM
    );
    return { success: false, error_code };
  } else {
    await serviceDb.updateTransfer(
      supabase,
      tx_id,
      serviceDb.TRANSFER_STATUS_REDEEMED,
      error_code,
      result_tx_id
    );
    await serviceDb.updateRecovery(
      supabase,
      tx_id,
      serviceDb.TRANSFER_STATUS_REDEEMED
    );
    return { success: true, to_chain_id, result_tx_id };
  }
}

module.exports = {
  redeem,
};
