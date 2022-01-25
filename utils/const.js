require('dotenv').config();

exports.CHAIN_ID_SOLANA = 1;
exports.CHAIN_ID_ETH = 2;
exports.CHAIN_ID_BSC = 4;
exports.SPL_TOKEN_PROGRAM = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
exports.ENVIRONMENT = process.env.ENVIRONMENT;
exports.SOLCHICK_MIGRATE_METHOD = process.env.SOLCHICK_MIGRATE_METHOD;
exports.NETWORK_IS_TEST =
  process.env.ENVIRONMENT === 'dev' || process.env.ENVIRONMENT === 'devnet';
exports.SOLANA_NETWORK = exports.NETWORK_IS_TEST ? 'devnet' : 'mainnet-beta';
exports.SOLANA_TOKEN_ADDRESS = process.env.SOLANA_TOKEN_ADDRESS;
exports.SOLCHICK_SERVICE_ACCOUNT_ON_SOL =
  process.env.SOLCHICK_SERVICE_ACCOUNT_ON_SOL;
exports.SOLCHICK_SERVICE_ACCOUNT_PRI_ON_SOL =
  process.env.SOLCHICK_SERVICE_ACCOUNT_PRI_ON_SOL;
exports.SOLCHICK_BRIDGE_PROGRAM = process.env.SOLCHICK_BRIDGE_PROGRAM;
exports.EVM_BURN_METHOD_ID = process.env.EVM_BURN_METHOD_ID.toUpperCase();
exports.EVM_TOKEN_ADDRESS_FOR_ETH = process.env.EVM_TOKEN_ADDRESS_FOR_ETH;
exports.SOLCHICK_SERVICE_ACCOUNT_ON_ETH =
  process.env.SOLCHICK_SERVICE_ACCOUNT_ON_ETH;
exports.SOLCHICK_SERVICE_ACCOUNT_PRI_ON_ETH =
  process.env.SOLCHICK_SERVICE_ACCOUNT_PRI_ON_ETH;
exports.EVM_TOKEN_ADDRESS_FOR_BSC = process.env.EVM_TOKEN_ADDRESS_FOR_BSC;
exports.SOLCHICK_SERVICE_ACCOUNT_ON_BSC =
  process.env.SOLCHICK_SERVICE_ACCOUNT_ON_ETH;
exports.SOLCHICK_SERVICE_ACCOUNT_PRI_ON_BSC =
  process.env.SOLCHICK_SERVICE_ACCOUNT_PRI_ON_BSC;
exports.ETH_RPC_URL = exports.NETWORK_IS_TEST
  ? process.env.ETH_RPC_URL_TEST
  : process.env.ETH_RPC_URL_MAIN;
exports.BSC_RPC_URL = exports.NETWORK_IS_TEST
  ? process.env.BSC_RPC_URL_TEST
  : process.env.BSC_RPC_URL_MAIN;

exports.readBigUInt64LE = (buffer, offset = 0) => {
  const first = buffer[offset];
  const last = buffer[offset + 7];
  if (first === undefined || last === undefined) {
    throw new Error('Out of bounds');
  }

  const lo =
    first +
    buffer[++offset] * 2 ** 8 +
    buffer[++offset] * 2 ** 16 +
    buffer[++offset] * 2 ** 24;

  const hi =
    buffer[++offset] +
    buffer[++offset] * 2 ** 8 +
    buffer[++offset] * 2 ** 16 +
    last * 2 ** 24;

  return BigInt(lo) + (BigInt(hi) << 32n);
};
