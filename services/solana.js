const Buffer = require('buffer').Buffer;
const BN = require('bn.js');
const anchor = require('@project-serum/anchor');
const bs58 = require('bs58');
const { Provider } = anchor;
const NodeWallet = require('@project-serum/anchor/dist/cjs/nodewallet').default;
const {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  u64,
} = require('@solana/spl-token');
const {
  Connection,
  PublicKey,
  Keypair,
  clusterApiUrl,
} = require('@solana/web3.js');
const {
  SPL_TOKEN_PROGRAM,
  SOLCHICK_MIGRATE_METHOD,
  SOLCHICK_SERVICE_ACCOUNT_PRI_ON_SOL,
  SOLANA_TOKEN_ADDRESS,
  SOLANA_NETWORK,
  SOLCHICK_BRIDGE_PROGRAM,
} = require('../utils/const');
const {
  SUCCESS,
  ERROR_TX_INVALID_ADDRESS,
  ERROR_TX_INVALID_TOKEN_AMOUNT,
  ERROR_TX_INVALID_STATUS,
  ERROR_TX_INVALID_METHOD,
  ERROR_TX_INVALID_INPUT_PARAM1,
  ERROR_TRANSFER_FAILED,
  ERROR_TX_INVALID_TARGET_ADDRESS,
} = require('./errors');
const logger = require('../services/winston');

let accountService = null;
let accountServiceAssocToken = null;
let bInit = false;
let mint = null;

const getServiceAccount = () => {
  return Keypair.fromSecretKey(
    Buffer.from(JSON.parse(SOLCHICK_SERVICE_ACCOUNT_PRI_ON_SOL))
  );
};

async function init() {
  logger.info('Starting: solana -> init');
  const options = Provider.defaultOptions();
  const connection = new Connection(
    clusterApiUrl(SOLANA_NETWORK),
    options.commitment
  );
  accountService = getServiceAccount();
  const wallet = new NodeWallet(accountService);
  const provider = new Provider(connection, wallet, options);
  anchor.setProvider(provider);
  logger.debug(`Payer: ${accountService.publicKey.toString()}`);
  logger.info('Finished: solana -> init');
  bInit = true;
}

function getMintObj() {
  if (mint === null) {
    mint = new Token(
      anchor.getProvider().connection,
      new PublicKey(SOLANA_TOKEN_ADDRESS),
      TOKEN_PROGRAM_ID,
      accountService
    );
  }
  return mint;
}

async function getAssociatedTokenKey(account) {
  return await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    new PublicKey(SOLANA_TOKEN_ADDRESS),
    new PublicKey(account)
  );
}

async function getServiceAssocKey() {
  if (accountServiceAssocToken) {
    return accountServiceAssocToken;
  }
  accountServiceAssocToken = await getAssociatedTokenKey(
    accountService.publicKey.toString()
  );
  return accountServiceAssocToken;
}

exports.getServiceAccountString = () => {
  if (accountService) {
    return accountService.publicKey.toString();
  }
  return getServiceAccount().publicKey.toString();
};

exports.isEnoughToken = async (amount) => {
  let serviceAccount = exports.getServiceAccountString();
  let tokenInfo = await exports.getTokenInfo(serviceAccount);
  logger.debug(`Token amount: ${tokenInfo.amount.toNumber()}`);
  const tokenAmount = tokenInfo.amount;
  const bnAmount = new BN(amount);
  return tokenAmount.gt(bnAmount);
};

exports.transfer = async (accountTarget, amount) => {
  if (!bInit) {
    await init();
  }
  let mintA = getMintObj();
  const keyServiceAssocToken = await getServiceAssocKey();
  const keyTargetAssocToken = await getAssociatedTokenKey(accountTarget);
  let feePercent = parseInt(process.env.BRIDGE_FEE);
  let uAmount = new u64(amount);
  let feeAmount = new u64(amount).muln(feePercent).divn(1000);
  let uTransferAmount = new u64(uAmount.sub(feeAmount).toString());
  logger.debug(`Target address: ${keyTargetAssocToken.toString()}`);
  logger.debug(`Transfer amount: ${uTransferAmount.toString()}`);
  try {
    let result = await mintA.transfer(
      keyServiceAssocToken,
      keyTargetAssocToken,
      accountService.publicKey,
      [accountService],
      uTransferAmount
    );
    return { success: true, data: result };
  } catch (e) {
    logger.debug(e.message);
    return { success: false, error_code: ERROR_TRANSFER_FAILED };
  }
};

exports.getTokenInfo = async (target) => {
  if (!bInit) {
    await init();
  }
  let mintA = getMintObj();
  const keyAssocTokenAddress = await getAssociatedTokenKey(target);
  logger.debug(`Associated address: ${keyAssocTokenAddress.toString()}`);
  let tokenAccountInfo = await mintA.getAccountInfo(keyAssocTokenAddress);
  logger.debug(`Token account info: ${tokenAccountInfo}`);
  return tokenAccountInfo;
};

const getTransactionInfo = async (txId) => {
  if (!bInit) {
    await init();
  }
  const connection = new Connection(clusterApiUrl(SOLANA_NETWORK), 'confirmed');
  return await connection.getTransaction(txId);
};

exports.validateTransaction = async (
  from_chain_id,
  from_address,
  tx_id,
  amount,
  to_address
) => {
  const txInfo = await getTransactionInfo(tx_id);
  logger.debug(`from_address: ${from_address}`);
  logger.debug(JSON.stringify(txInfo));
  logger.debug(JSON.stringify(txInfo.transaction.message.instructions));

  if (!txInfo || !txInfo.meta || txInfo.meta.err) {
    return ERROR_TX_INVALID_STATUS;
  }

  let accountKeys = txInfo.transaction.message.accountKeys;
  if (accountKeys.length !== 5) {
    logger.debug(
      `ERROR_FAILED_VALIDATION_INVALID_INPUT -> ${accountKeys.length}`
    );
    return ERROR_TX_INVALID_INPUT_PARAM1;
  }

  let keyServiceAssocToken = await getServiceAssocKey();
  let keyAssocTokenAddress = await getAssociatedTokenKey(from_address);

  outputAssociatedTokenAddresses(
    keyServiceAssocToken,
    keyAssocTokenAddress,
    accountKeys
  );

  if (
    accountKeys[0].toString().toUpperCase() !== from_address.toUpperCase() ||
    accountKeys[1].toString().toUpperCase() !==
      keyAssocTokenAddress.toString().toUpperCase() ||
    accountKeys[2].toString().toUpperCase() !==
      keyServiceAssocToken.toString().toUpperCase() ||
    accountKeys[3].toString().toUpperCase() !==
      SPL_TOKEN_PROGRAM.toUpperCase() ||
    accountKeys[4].toString().toUpperCase() !==
      SOLCHICK_BRIDGE_PROGRAM.toUpperCase()
  ) {
    return ERROR_TX_INVALID_ADDRESS;
  }

  let instructions = txInfo.transaction.message.instructions;
  if (!Array.isArray(instructions) || instructions.length !== 1) {
    return ERROR_TX_INVALID_INPUT_PARAM1;
  }

  let inputData = bs58.decode(instructions[0].data);

  let method = new BN(Buffer.from(inputData.slice(0, 8)));
  if (
    method.toString('hex').toUpperCase() !==
    SOLCHICK_MIGRATE_METHOD.toUpperCase()
  ) {
    logger.debug(`ERROR_FAILED_VALIDATION_METHOD -> ${method.toString('hex')}`);
    return ERROR_TX_INVALID_METHOD;
  }

  let bnTxAmount = new BN(Buffer.from(inputData.slice(8, 16)), 'hex', 'le');
  let bnParamAmount = new BN(amount.toString());
  if (!bnTxAmount.eq(bnParamAmount)) {
    return ERROR_TX_INVALID_TOKEN_AMOUNT;
  }

  // Check target address
  let bnTargetAddress = new BN(
    Buffer.from(inputData.slice(17, 37)),
    'hex',
    'le'
  );
  let txTargetAddress = ('0x' + bnTargetAddress.toString('hex')).toLowerCase();
  logger.debug(`txTargetAddress: ${txTargetAddress}, to_address: ${to_address}`);

  if (txTargetAddress !== to_address.toLowerCase()) {
    return ERROR_TX_INVALID_TARGET_ADDRESS;
  }

  return SUCCESS;
};

exports.validateHashTransaction = async (from_chain_id, tx_id) => {
  const txInfo = await getTransactionInfo(tx_id);
  logger.debug(JSON.stringify(txInfo));
  logger.debug(JSON.stringify(txInfo.transaction.message.instructions));

  if (!txInfo || !txInfo.meta || txInfo.meta.err) {
    return { success: false, error_code: ERROR_TX_INVALID_STATUS };
  }

  let accountKeys = txInfo.transaction.message.accountKeys;
  if (accountKeys.length !== 5) {
    logger.debug(
      `ERROR_FAILED_VALIDATION_INVALID_INPUT: ${accountKeys.length}`
    );
    return { success: false, error_code: ERROR_TX_INVALID_INPUT_PARAM1 };
  }
  let keyServiceAssocToken = await getServiceAssocKey();
  let from_address = accountKeys[0].toString();
  let keyAssocTokenAddress = await getAssociatedTokenKey(from_address);

  outputAssociatedTokenAddresses(
    keyServiceAssocToken,
    keyAssocTokenAddress,
    accountKeys
  );

  if (
    accountKeys[1].toString().toUpperCase() !==
      keyAssocTokenAddress.toString().toUpperCase() ||
    accountKeys[2].toString().toUpperCase() !==
      keyServiceAssocToken.toString().toUpperCase() ||
    accountKeys[3].toString().toUpperCase() !==
      SPL_TOKEN_PROGRAM.toUpperCase() ||
    accountKeys[4].toString().toUpperCase() !==
      SOLCHICK_BRIDGE_PROGRAM.toUpperCase()
  ) {
    return { success: false, error_code: ERROR_TX_INVALID_ADDRESS };
  }

  let instructions = txInfo.transaction.message.instructions;
  if (!Array.isArray(instructions) || instructions.length !== 1) {
    return { success: false, error_code: ERROR_TX_INVALID_INPUT_PARAM1 };
  }

  let inputData = bs58.decode(instructions[0].data);

  let method = new BN(Buffer.from(inputData.slice(0, 8)));
  if (
    method.toString('hex').toUpperCase() !==
    SOLCHICK_MIGRATE_METHOD.toUpperCase()
  ) {
    logger.debug(`ERROR_FAILED_VALIDATION_METHOD: ${method.toString('hex')}`);
    return { success: false, error_code: ERROR_TX_INVALID_METHOD };
  }

  let bnTxAmount = new BN(Buffer.from(inputData.slice(8, 16)), 'hex', 'le');
  let bnTargetChain = new BN(Buffer.from(inputData.slice(16, 17)), 'hex', 'le');
  let bnTargetAddress = new BN(
    Buffer.from(inputData.slice(17, 37)),
    'hex',
    'le'
  );
  let txTargetAddress = ('0x' + bnTargetAddress.toString('hex')).toLowerCase();

  return {
    success: true,
    amount: bnTxAmount.toString(10),
    from_address,
    to_chain_id: bnTargetChain.toNumber(),
    to_address: txTargetAddress,
  };
};

function outputAssociatedTokenAddresses(
  keyServiceAssocToken,
  keyAssocTokenAddress,
  accountKeys
) {
  logger.debug(`keyServiceAssocToken: ${keyServiceAssocToken.toString()}`);
  logger.debug(`keyAssocTokenAddress: ${keyAssocTokenAddress.toString()}`);
  logger.debug(`accountKeys: ${accountKeys[0].toString().toUpperCase()}`);
  logger.debug(`accountKeys: ${accountKeys[1].toString().toUpperCase()}`);
  logger.debug(`accountKeys: ${accountKeys[2].toString().toUpperCase()}`);
  logger.debug(`accountKeys: ${accountKeys[3].toString().toUpperCase()}`);
  logger.debug(`accountKeys: ${accountKeys[4].toString().toUpperCase()}`);
}
