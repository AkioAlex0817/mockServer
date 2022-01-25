const Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
const BN = require('bn.js');
const BigNumber = require('bignumber.js');
const Wallet = require('ethereumjs-wallet');
const EthUtil = require('ethereumjs-util');
const { ethers, BigNumber: EthersBigNumber } = require('ethers');
const {
  CHAIN_ID_ETH,
  CHAIN_ID_BSC,
  EVM_TOKEN_ADDRESS_FOR_ETH,
  EVM_TOKEN_ADDRESS_FOR_BSC,
  EVM_BURN_METHOD_ID,
  SOLCHICK_SERVICE_ACCOUNT_PRI_ON_ETH,
  SOLCHICK_SERVICE_ACCOUNT_PRI_ON_BSC,
  ETH_RPC_URL,
  BSC_RPC_URL,
} = require('../utils/const');
const {
  SUCCESS,
  ERROR_TX_INVALID_ADDRESS,
  ERROR_TX_INVALID_TOKEN_AMOUNT,
  ERROR_TX_INVALID_STATUS,
  ERROR_TX_INVALID_METHOD,
  ERROR_TX_INVALID_INPUT_PARAM1,
  ERROR_TX_NO_DATA,
  ERROR_TX_INVALID_INPUT_PARAM2,
  ERROR_TRANSFER_FAILED,
  ERROR_TX_INVALID_TARGET_ADDRESS,
} = require('./errors');
const { PublicKey } = require('@solana/web3.js');
const logger = require('../services/winston');

const SmartContractABI =
  require('../artifacts/contracts/WChickToken.sol/WChickToken.json').abi;

function getEndpoint(chain_id) {
  let endpoint;
  if (chain_id === CHAIN_ID_ETH) {
    endpoint = ETH_RPC_URL;
  } else {
    endpoint = BSC_RPC_URL;
  }
  return endpoint;
}

function getServiceAccountPrivateKey(chain_id) {
  if (chain_id === CHAIN_ID_ETH) {
    return SOLCHICK_SERVICE_ACCOUNT_PRI_ON_ETH;
  } else {
    return SOLCHICK_SERVICE_ACCOUNT_PRI_ON_BSC;
  }
}

function getTokenAddress(chain_id) {
  if (chain_id === CHAIN_ID_ETH) {
    logger.debug(`getTokenAddress ${chain_id} ETH`);
    return EVM_TOKEN_ADDRESS_FOR_ETH;
  } else {
    logger.debug(`getTokenAddress ${chain_id} BSC`);
    return EVM_TOKEN_ADDRESS_FOR_BSC;
  }
}

function getAddressByPrivateKey(priKey) {
  const privateKeyBuffer = EthUtil.toBuffer(`0x${priKey}`);
  const wallet = Wallet['default'].fromPrivateKey(privateKeyBuffer);
  return wallet.getAddressString();
}

function calculateGasMargin(value) {
  return value
    .mul(EthersBigNumber.from(10000).add(EthersBigNumber.from(1000)))
    .div(EthersBigNumber.from(10000));
}

exports.transfer = async (chain_id, target, amount) => {
  logger.info('Starting: ether -> transfer');
  const priKey = getServiceAccountPrivateKey(chain_id);
  let provider = ethers.getDefaultProvider(getEndpoint(chain_id));
  let wallet = new ethers.Wallet(priKey, provider);
  try {
    let contract = new ethers.Contract(
      getTokenAddress(chain_id),
      SmartContractABI,
      wallet
    );
    const estimatedGas = await contract.estimateGas.transfer(
      target,
      EthersBigNumber.from(amount)
    );
    logger.info(estimatedGas.toNumber());
    const transaction = await contract.transfer(
      target,
      EthersBigNumber.from(amount),
      {
        gasLimit: calculateGasMargin(estimatedGas),
      }
    );
    await transaction.wait();
    const txId = transaction.hash;
    logger.info(txId);
    if (txId) {
      return { success: true, data: txId };
    } else {
      return { success: false, error_code: ERROR_TRANSFER_FAILED };
    }
  } catch (e) {
    logger.error(e.message);
    return { success: false, error_code: ERROR_TRANSFER_FAILED };
  }
};

// const getTransactionInfo = async (chain_id, txId) => {
//   let provider = new Provider(
//     getServiceAccountPrivateKey(chain_id),
//     getEndpoint(chain_id)
//   );
//   let web3 = new Web3(provider);
//   let receipt = await web3.eth.getTransactionReceipt(txId);
//   let info = await web3.eth.getTransaction(txId);
//   return [receipt, info];
// };

const getTransactionInfoV2 = async (chain_id, txId) => {
  let provider = ethers.getDefaultProvider(getEndpoint(chain_id));
  let receipt = await provider.getTransactionReceipt(txId);
  let info = await provider.getTransaction(txId);
  return [receipt, info];
};

exports.getServiceAccountString = (chain_id) => {
  const priKey = getServiceAccountPrivateKey(chain_id);
  return getAddressByPrivateKey(priKey);
};

exports.isEVMChain = (chain_id) => {
  return chain_id === CHAIN_ID_BSC || chain_id === CHAIN_ID_ETH;
};

// exports.isEnoughToken = async (chain_id, amount) => {
//   const priKey = getServiceAccountPrivateKey(chain_id);
//   const serviceAccount = getAddressByPrivateKey(priKey);
//   logger.debug(`serviceAccount:  ${serviceAccount}`);
//
//   let provider = new Provider(priKey, getEndpoint(chain_id));
//   try {
//     let web3 = new Web3(provider);
//     let myContract = new web3.eth.Contract(
//       SmartContractABI,
//       getTokenAddress(chain_id)
//     );
//
//     // noinspection JSUnresolvedFunction
//     let result = await myContract.methods.balanceOf(serviceAccount).call();
//     const biTokenAmount = new BigNumber(result);
//     const biAmount = new BigNumber(amount);
//     return biTokenAmount.gt(biAmount);
//   } catch (e) {
//     logger.error(e);
//     return false;
//   }
// };

exports.validateTransaction = async (
  from_chain_id,
  from_address,
  txId,
  amount,
  to_address
) => {
  const [receipt, txInfo] = await getTransactionInfoV2(from_chain_id, txId);
  const priKey = getServiceAccountPrivateKey(from_chain_id);
  const serviceAccount = getAddressByPrivateKey(priKey);
  logger.debug(`serviceAccount:  ${serviceAccount}`);

  if (!receipt || !txInfo) {
    return ERROR_TX_NO_DATA;
  }

  console.log(receipt, txInfo);
  if (receipt.status !== 1) {
    return ERROR_TX_INVALID_STATUS;
  }

  const tokenAddress = getTokenAddress(from_chain_id);
  if (
    receipt.from.toUpperCase() !== from_address.toUpperCase() ||
    receipt.to.toUpperCase() !== tokenAddress.toUpperCase()
  ) {
    console.log(
      'ERROR_FAILED_VALIDATION_ADDRESS',
      receipt.from,
      from_address,
      receipt.to,
      tokenAddress
    );
    logger.debug(
      `ERROR_FAILED_VALIDATION_ADDRESS -> ` +
        `receipt.from: ${receipt.from}, from_address: ${from_address}, ` +
        `receipt.to: ${receipt.to}, tokenAddress: ${tokenAddress}`
    );
    return ERROR_TX_INVALID_ADDRESS;
  }

  if (!txInfo.data || txInfo.data.length !== 266) {
    logger.debug(`ERROR_TX_INVALID_INPUT_PARAM1 -> ${txInfo.data}`);
    return ERROR_TX_INVALID_INPUT_PARAM1;
  }
  const methodId = txInfo.data.slice(0, 10).toUpperCase();
  logger.debug(`methodId: ${methodId}`);

  if (methodId !== EVM_BURN_METHOD_ID.toUpperCase()) {
    logger.debug(`ERROR_TX_INVALID_METHOD -> ${EVM_BURN_METHOD_ID}`);
    return ERROR_TX_INVALID_METHOD;
  }

  const len = serviceAccount.length;
  if (len > 66) {
    logger.debug(`ERROR_TX_INVALID_INPUT_PARAM1 -> ${len}`);
    return ERROR_TX_INVALID_INPUT_PARAM1;
  }

  const addressData = txInfo.data.slice(10 + (66 - len), 10 + 64);
  const amountData = txInfo.data.slice(10 + 64, 10 + 128);
  if (
    addressData.toString().toUpperCase() !==
    serviceAccount.slice(2).toUpperCase()
  ) {
    return ERROR_TX_INVALID_INPUT_PARAM2;
  }

  let bnParamAmount = new BigNumber(`${amount}`);
  let bnTxAmount = new BigNumber(`0x${amountData}`);
  if (!bnTxAmount.eq(bnParamAmount)) {
    return ERROR_TX_INVALID_TOKEN_AMOUNT;
  }

  let { txTargetAddress } = getTxTargetAddress(txInfo);
  logger.debug(`txTargetAddress: ${txTargetAddress}`);

  if (txTargetAddress.toLowerCase() !== to_address.toLowerCase()) {
    return ERROR_TX_INVALID_TARGET_ADDRESS;
  }

  return SUCCESS;
};

exports.validateHashTransaction = async (from_chain_id, txId) => {
  const [receipt, txInfo] = await getTransactionInfoV2(from_chain_id, txId);
  const priKey = getServiceAccountPrivateKey(from_chain_id);
  const serviceAccount = getAddressByPrivateKey(priKey);
  logger.debug(`serviceAccount: ${serviceAccount}`);

  if (!receipt || !txInfo) {
    return { success: false, error_code: ERROR_TX_NO_DATA };
  }

  if (receipt.status !== 1) {
    return { success: false, error_code: ERROR_TX_INVALID_STATUS };
  }

  const tokenAddress = getTokenAddress(from_chain_id);
  const from_address = receipt.from;
  if (receipt.to.toUpperCase() !== tokenAddress.toLocaleUpperCase()) {
    logger.debug(
      `ERROR_TX_INVALID_ADDRESS -> ` +
        `receipt.from: ${receipt.from}, from_address: ${from_address}, ` +
        `receipt.to: ${receipt.to}, tokenAddress: ${tokenAddress}`
    );
    return { success: false, error_code: ERROR_TX_INVALID_ADDRESS };
  }

  if (!txInfo.data || txInfo.data.length !== 266) {
    logger.debug('ERROR_TX_INVALID_INPUT_PARAM1 -> ', txInfo.data);
    return { success: false, error_code: ERROR_TX_INVALID_INPUT_PARAM1 };
  }

  const methodId = txInfo.data.slice(0, 10).toUpperCase();
  logger.debug(methodId);
  if (methodId !== EVM_BURN_METHOD_ID.toUpperCase()) {
    logger.debug(`ERROR_TX_INVALID_METHOD -> ${methodId}`);
    return { success: false, error_code: ERROR_TX_INVALID_METHOD };
  }

  const len = serviceAccount.length;
  if (len > 66) {
    logger.debug(`ERROR_TX_INVALID_INPUT_PARAM1 -> ${len}`);
    return { success: false, error_code: ERROR_TX_INVALID_INPUT_PARAM1 };
  }

  const addressData = txInfo.data.slice(10 + (66 - len), 10 + 64);
  if (
    addressData.toString().toUpperCase() !==
    serviceAccount.slice(2).toUpperCase()
  ) {
    return { success: false, error_code: ERROR_TX_INVALID_INPUT_PARAM2 };
  }

  const amountData = txInfo.data.slice(10 + 64, 10 + 128);
  let bnTxAmount = new BigNumber(`0x${amountData}`);

  let { bnTxTargetChain, txTargetAddress } = getTxTargetAddress(txInfo);
  return {
    success: true,
    amount: bnTxAmount.toString(10),
    from_address: from_address,
    to_chain_id: bnTxTargetChain,
    to_address: txTargetAddress,
  };
};

function getTxTargetAddress(txInfo) {
  const txTargetChain = txInfo.data.slice(10 + 128, 10 + 192);
  const txTargetAddressHex = txInfo.data.slice(10 + 192, 10 + 256);
  let bnTxTargetChain = new BigNumber(txTargetChain).toNumber();
  let txTargetAddress;
  if (exports.isEVMChain(bnTxTargetChain)) {
    txTargetAddress = '0x' + txTargetAddressHex.slice(24);
  } else {
    txTargetAddress = new PublicKey(
      new BN(txTargetAddressHex, 'hex', 'be').toBuffer()
    ).toString();
  }
  return { bnTxTargetChain, txTargetAddress };
}
