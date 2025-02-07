use openzeppelin_stylus::token::erc20::Erc20;
use stylus_sdk::prelude::*;

#[entrypoint]
#[storage]
struct Erc20Example {
    #[borrow]
    pub erc20: Erc20,
}

#[public]
#[inherit(Erc20)]
impl Erc20Example {}
