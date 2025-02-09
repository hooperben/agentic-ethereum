// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract SmartVault {
    address private _owner;
    mapping(address => mapping(address => uint256)) public balances;

    error OwnableInvalidOwner(address owner);

    constructor() payable {
        _owner = 0x085bBc82f142e713c8a19435D672B4170076A867;
    }
}
