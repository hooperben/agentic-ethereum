// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract SmartVault {
    address private _owner;
    mapping(address => mapping(address => uint256)) public balances;

    error OwnableInvalidOwner(address owner);

    constructor(address owner) payable {
        // Required to set the owner for the Ownable inheritance
        if (owner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _owner = owner;
    }
}
