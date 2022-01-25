const serviceSolana = require('../services/solana');
const serviceEVM = require('../services/ether');
const { ERROR_TRANSFER_UNKNOWN } = require('./errors');
const winston = require('../services/winston');

exports.transfer = async (to_chain_id, to_address, amount) => {
  let result_tx_id;
  let error_code = 0;

  try {
    let result;
    if (serviceEVM.isEVMChain(to_chain_id)) {
      result = await serviceEVM.transfer(to_chain_id, to_address, amount);
    } else {
      result = await serviceSolana.transfer(to_address, amount);
    }
    if (result.success) {
      result_tx_id = result.data;
    } else {
      error_code = result.error_code;
    }
  } catch (e) {
    winston.error(e);
    error_code = ERROR_TRANSFER_UNKNOWN;
  }

  return { result_tx_id, error_code };
};
