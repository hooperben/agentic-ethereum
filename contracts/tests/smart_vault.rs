#![cfg(feature = "e2e")]

// use abi::VestingWallet;
// use alloy::{
//     eips::BlockId,
//     primitives::{Address, U256},
//     providers::Provider,
//     rpc::types::BlockTransactionsKind,
//     sol,
// };
// use alloy_sol_macro::sol;
// use e2e::{receipt, send, watch, Account, EventExt, Panic, PanicCode, ReceiptExt, Revert};

use alloy_sol_macro::sol;

mod abi;

sol!("src/constructor.sol");

#[e2e::test]
async fn accounts_are_funded() -> eyre::Result<()> {
    assert_eq!(2, 1);
    // let balance = alice.wallet.get_balance(alice.address()).await?;
    // let expected = parse_ether("10")?;
    // assert_eq!(expected, balance);
    // Ok(())
}
