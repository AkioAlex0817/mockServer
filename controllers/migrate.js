const {
  SUCCESS,
  ERROR_TX_INVALID_INPUT_UNKNOWN,
  ERROR_DB_DUPLICATED,
  ERROR_DB_UNKNOWN,
  ERROR_DB_CONNECTION_FAILED,
  ERROR_UNKNOWN,
  addErrorMessage,
} = require('../services/errors');
const serviceDb = require('../services/db');
const serviceSolana = require('../services/solana');
const serviceEVM = require('../services/ether');
const serviceShared = require('../services/shared');
const logger = require('../services/winston');

async function migrate(req, res) {
  const {
    tchid: to_chain_id,
    taddr: to_address,
    schid: from_chain_id,
    saddr: from_address,
    amount,
    code,
    txid: txId,
  } = req.query;
  logger.debug(JSON.stringify(req.query));

  let result;
  try {
    result = await _migrate(
      parseInt(to_chain_id),
      to_address,
      amount,
      txId,
      parseInt(from_chain_id),
      from_address,
      code
    );
  } catch (e) {
    logger.error(e);
    result = { success: false, error_code: ERROR_UNKNOWN };
  }
  res.json(addErrorMessage(result));
}
async function _migrate(
  to_chain_id,
  to_address,
  amount,
  tx_id,
  from_chain_id,
  from_address,
  hash
) {
  logger.debug(
    `to_chain_id: ${to_chain_id}, to_address: ${to_address}, amount: ${amount}, from_chain_id: ${from_chain_id}`
  );

  logger.info(`Starting validation`);
  try {
    let checkCode;
    if (serviceEVM.isEVMChain(from_chain_id)) {
      checkCode = await serviceEVM.validateTransaction(
        from_chain_id,
        from_address,
        tx_id,
        amount,
        to_address
      );
    } else {
      checkCode = await serviceSolana.validateTransaction(
        from_chain_id,
        from_address,
        tx_id,
        amount,
        to_address
      );
    }
    if (checkCode !== SUCCESS) {
      return { success: false, error_code: checkCode };
    }
  } catch (e) {
    logger.error(e);
    return { success: false, error_code: ERROR_TX_INVALID_INPUT_UNKNOWN };
  }
  logger.info(`Finished validation`);

  logger.info(`Starting database transaction`);
  let supabase = null;
  try {
    supabase = serviceDb.getSupabase();
    let result = await serviceDb.insertTransfer(
      supabase,
      from_chain_id,
      from_address,
      tx_id,
      to_chain_id,
      to_address,
      amount,
      hash,
      serviceDb.TRANSFER_STATUS_SENDING
    );
    logger.debug(JSON.stringify(result));
    if (result.error || result.status !== 201) {
      if (result.statusText === 'Conflict') {
        return { success: false, error_code: ERROR_DB_DUPLICATED };
      } else {
        return { success: false, error_code: ERROR_DB_UNKNOWN };
      }
    }
  } catch (e) {
    logger.error(e);
    return { success: false, error_code: ERROR_DB_CONNECTION_FAILED };
  }
  logger.info(`Finished database transaction`);

  logger.info(`Starting transfer`);
  const { result_tx_id, error_code } = await serviceShared.transfer(
    to_chain_id,
    to_address,
    amount
  );
  logger.debug(`error_code: ${error_code}, result_tx_id: ${result_tx_id}`);
  logger.info('Finished transfer');

  await serviceDb.updateTransfer(
    supabase,
    tx_id,
    error_code > 0
      ? serviceDb.TRANSFER_STATUS_FAILED_SEND
      : serviceDb.TRANSFER_STATUS_SENT,
    error_code,
    result_tx_id
  );

  if (error_code > 0) {
    return { success: false, error_code };
  } else {
    return { success: true, result_tx_id };
  }
}

module.exports = {
  migrate,
};
