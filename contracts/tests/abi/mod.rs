#![allow(dead_code)]
use alloy::sol;

sol!(
     #[sol(rpc)]
     contract SmartVasult {
          function owner() public view virtual returns (address owner);

          error OwnableInvalidOwner(address owner);
          error TransferFailed(call::Error);
    }
);
