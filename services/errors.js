const SUCCESS = 200;
const ERROR_UNKNOWN = 510;
const ERROR_TX_NO_DATA = 1001;
const ERROR_TX_INVALID_ADDRESS = 1002;
const ERROR_TX_INVALID_TOKEN = 1003;
const ERROR_TX_INVALID_TOKEN_AMOUNT = 1004;
const ERROR_TX_INVALID_STATUS = 1005;
const ERROR_TX_INVALID_METHOD = 1006;
const ERROR_TX_INVALID_TARGET_ADDRESS = 1007;
const ERROR_TX_INVALID_INPUT_PARAM1 = 1008;
const ERROR_TX_INVALID_INPUT_PARAM2 = 1009;
const ERROR_TX_INVALID_INPUT_PARAM3 = 1010;
const ERROR_TX_INVALID_INPUT_UNKNOWN = 1100;
const ERROR_DB_DUPLICATED = 2001;
const ERROR_DB_ALREADY_DONE = 2002;
const ERROR_DB_PROCESSING = 2003;
const ERROR_DB_UNKNOWN = 2101;
const ERROR_DB_CONNECTION_FAILED = 2102;
const ERROR_TRANSFER_FAILED = 5001;
const ERROR_TRANSFER_UNKNOWN = 5101;

function getErrorMessage(error_code) {
  switch (error_code) {
    default:
    case ERROR_UNKNOWN:
      return 'Unknown error';
    case ERROR_TX_INVALID_INPUT_UNKNOWN:
    case ERROR_TX_NO_DATA:
    case ERROR_TX_INVALID_ADDRESS:
    case ERROR_TX_INVALID_TOKEN:
    case ERROR_TX_INVALID_TOKEN_AMOUNT:
    case ERROR_TX_INVALID_STATUS:
    case ERROR_TX_INVALID_METHOD:
    case ERROR_TX_INVALID_TARGET_ADDRESS:
    case ERROR_TX_INVALID_INPUT_PARAM1:
    case ERROR_TX_INVALID_INPUT_PARAM2:
    case ERROR_TX_INVALID_INPUT_PARAM3:
      return 'Invalid transaction hash';
    case ERROR_DB_DUPLICATED:
      return 'The request is duplicated';
    case ERROR_DB_ALREADY_DONE:
      return 'The request is already finished';
    case ERROR_DB_PROCESSING:
      return 'The request is already processing';
    case ERROR_DB_UNKNOWN:
      return 'Service unavailable';
    case ERROR_DB_CONNECTION_FAILED:
      return 'Service unavailable';
    case ERROR_TRANSFER_FAILED:
      return 'Service unavailable';
    case ERROR_TRANSFER_UNKNOWN:
      return 'Service unavailable';
  }
}

function addErrorMessage(res) {
  const { success, error_code, ...others } = res;
  if (!success && error_code) {
    return {
      success,
      error_code,
      error_message: getErrorMessage(error_code),
      ...others,
    };
  } else {
    return res;
  }
}
module.exports = {
  SUCCESS,
  ERROR_UNKNOWN,
  ERROR_TX_NO_DATA,
  ERROR_TX_INVALID_ADDRESS,
  ERROR_TX_INVALID_TOKEN,
  ERROR_TX_INVALID_TOKEN_AMOUNT,
  ERROR_TX_INVALID_STATUS,
  ERROR_TX_INVALID_METHOD,
  ERROR_TX_INVALID_TARGET_ADDRESS,
  ERROR_TX_INVALID_INPUT_PARAM1,
  ERROR_TX_INVALID_INPUT_PARAM2,
  ERROR_TX_INVALID_INPUT_PARAM3,
  ERROR_TX_INVALID_INPUT_UNKNOWN,
  ERROR_DB_DUPLICATED,
  ERROR_DB_ALREADY_DONE,
  ERROR_DB_PROCESSING,
  ERROR_DB_UNKNOWN,
  ERROR_DB_CONNECTION_FAILED,
  ERROR_TRANSFER_FAILED,
  ERROR_TRANSFER_UNKNOWN,
  getErrorMessage,
  addErrorMessage,
};
