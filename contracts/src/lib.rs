#![cfg_attr(not(test), no_main)]
extern crate alloc;

use alloc::vec::Vec;

use alloy_primitives::{Address, U160, U256};
use openzeppelin_stylus::{
    access::ownable,
    token::erc20::{extensions::Erc20Metadata, Erc20, IErc20},
};
use stylus_sdk::{
    call, contract, msg,
    prelude::{entrypoint, public, sol_interface, storage, SolidityError},
    storage::{StorageMap, StorageU256},
};

#[entrypoint]
#[storage]
struct SmartVault {
    #[borrow]
    pub ownable: ownable::Ownable,

    // Token -> Owner -> Amount
    pub balances: StorageMap<Address, StorageMap<Address, StorageU256>>,
}

sol_interface! {
    interface IERC20 {
        function total_supply() external returns (uint256);
        function transfer(address to, uint256 value) external returns (bool);
        function transfer_from(address from, address to, uint256 value) external returns (bool);
    }
}

/// An error that occurred in the [`VestingWallet`] contract.
#[derive(SolidityError, Debug)]
pub enum Error {
    TransferFailed(call::Error),
    // /// Error type from [`SafeErc20`] contract [`safe_erc20::Error`].
    // SafeErc20(safe_erc20::Error),
    // /// The token address is not valid. (eg. `Address::ZERO`).
    // InvalidToken(InvalidToken),
}

impl SmartVault {
    pub fn zero_address(&self) -> Address {
        Address::from(U160::from(0x0))
    }
}

#[public]
impl SmartVault {
    #[payable]
    pub fn deposit(&mut self, erc20: IERC20, mut amount: U256) -> Result<(), Error> {
        if erc20.address == self.zero_address() {
            if msg::value() != amount {
                amount = msg::value();
            }
        } else {
            erc20
                .transfer_from(&mut *self, msg::sender(), contract::address(), amount)
                .map_err(|e| Error::TransferFailed(call::Error::from(e)))?;
        }

        // Increase the balance of the sender
        self.balances
            .setter(erc20.address)
            .setter(msg::sender())
            .set(amount);

        Ok(())
    }

    pub fn withdraw(&mut self, erc20: IERC20, amount: U256) -> Result<(), Error> {
        if erc20.address == self.zero_address() {
            // self.withdraw_native(amount);
        } else {
            erc20
                .transfer(self, msg::sender(), amount)
                .map_err(|e| Error::TransferFailed(call::Error::from(e)))?;
        }

        Ok(())
    }

    fn owner(&self) -> Address {
        self.ownable.owner()
    }
}
