require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseJs = require('@supabase/supabase-js');
const { createClient } = supabaseJs;
const TBL_NAME_TRANSFER = 'bridge_transfers';
const TBL_NAME_RECOVERY = 'bridge_recoveries';

exports.TRANSFER_STATUS_SENDING = 0;
exports.TRANSFER_STATUS_REDEEMING = 1;
exports.TRANSFER_STATUS_SENT = 10;
exports.TRANSFER_STATUS_REDEEMED = 11;
exports.TRANSFER_STATUS_FAILED_SEND = 21;
exports.TRANSFER_STATUS_FAILED_REDEEM = 22;

exports.getSupabase = () => {
  return createClient(supabaseUrl, supabaseAnonKey);
};

exports.fetchTransfer = async (supabase, tx_id) => {
  return await supabase
    .from(TBL_NAME_TRANSFER)
    .select()
    .match({ transaction: tx_id })
    .limit(1)
    .single();
};

exports.insertTransfer = async (
  supabase,
  source_chain,
  source_address,
  transaction,
  target_chain,
  target_address,
  amount,
  hash,
  status
) => {
  return await supabase.from(TBL_NAME_TRANSFER).insert(
    {
      source_chain,
      source_address,
      transaction,
      target_chain,
      target_address,
      amount,
      hash,
      status,
    },
    { returning: 'minimal' }
  );
};

exports.updateTransfer = async (
  supabase,
  transaction,
  status,
  error_code,
  target_transaction
) => {
  return await supabase
    .from(TBL_NAME_TRANSFER)
    .update({
      status,
      error_code,
      target_transaction,
    })
    .match({ transaction: transaction });
};

exports.fetchRecovery = async (supabase, tx_id) => {
  return await supabase
    .from(TBL_NAME_RECOVERY)
    .select()
    .match({ transaction: tx_id })
    .limit(1)
    .single();
};

exports.insertRecovery = async (supabase, transaction, status) => {
  return await supabase.from(TBL_NAME_RECOVERY).insert(
    {
      transaction,
      status,
    },
    { returning: 'minimal' }
  );
};

exports.updateRecovery = async (supabase, transaction, status) => {
  return await supabase
    .from(TBL_NAME_RECOVERY)
    .update({
      status,
    })
    .match({ transaction: transaction });
};
