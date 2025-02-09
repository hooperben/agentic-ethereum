#![cfg_attr(not(test), no_main)]
extern crate alloc;

use alloy_primitives::{Address, U160, U256};
use openzeppelin_stylus::access::ownable;
use stylus_sdk::{
    call::{self, transfer_eth},
    contract, msg,
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

        let current_balance = self.balances.get(erc20.address).get(msg::sender());

        // Increase the balance of the sender
        self.balances
            .setter(erc20.address)
            .setter(msg::sender())
            .set(current_balance + amount);

        Ok(())
    }

    pub fn withdraw(&mut self, erc20: IERC20, _amount: U256) -> Result<(), Error> {
        let current_balance = self.balances.get(erc20.address).get(msg::sender());

        let mut amount_to_withdraw = _amount;
        if current_balance < amount_to_withdraw {
            amount_to_withdraw = current_balance;
        }

        if erc20.address == self.zero_address() {
            transfer_eth(msg::sender(), amount_to_withdraw)
                .map_err(|e| Error::TransferFailed(call::Error::Revert(e)))?;
        } else {
            erc20
                .transfer(&mut *self, msg::sender(), amount_to_withdraw)
                .map_err(|e| Error::TransferFailed(call::Error::from(e)))?;
        }

        // Decrease the balance of the sender
        self.balances
            .setter(erc20.address)
            .setter(msg::sender())
            .set(current_balance - amount_to_withdraw);

        Ok(())
    }

    pub fn batch_transfer_tokens(
        &mut self,
        tokens: Vec<IERC20>,
        to: Vec<Address>,
        amounts: Vec<U256>,
    ) -> Result<(), Error> {
        for (i, token) in tokens.iter().enumerate() {
            self.transfer_token(IERC20::new(token.address), to[i], amounts[i])?;
        }

        Ok(())
    }

    pub fn transfer_token(
        &mut self,
        erc20: IERC20,
        to: Address,
        amount: U256,
    ) -> Result<(), Error> {
        let current_balance = self.balances.get(erc20.address).get(msg::sender());

        if current_balance < amount {
            return Err(Error::TransferFailed(call::Error::Revert(
                b"Insufficient balance".to_vec(),
            )));
        }

        // Decrease the balance of the sender
        self.balances
            .setter(erc20.address)
            .setter(msg::sender())
            .set(current_balance - amount);

        // Increase the balance of the receiver
        let receiver_balance = self.balances.get(erc20.address).get(to);

        self.balances
            .setter(erc20.address)
            .setter(to)
            .set(receiver_balance + amount);

        Ok(())
    }

    fn owner(&self) -> Address {
        self.ownable.owner()
    }
}
