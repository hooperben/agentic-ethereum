// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Registry {
    // Mapping from name to address
    mapping(string => address) private records;

    // Mapping to track name ownership
    mapping(string => address) private nameOwner;

    // Events
    event NameRegistered(string indexed name, address indexed owner);
    event RecordUpdated(string indexed name, address indexed newAddress);
    event NameTransferred(
        string indexed name,
        address indexed previousOwner,
        address indexed newOwner
    );

    // Register a new name
    function register(string memory name) public {
        require(nameOwner[name] == address(0), "Name is already registered");
        nameOwner[name] = msg.sender;
        records[name] = msg.sender; // Initially set the record to the owner's address
        emit NameRegistered(name, msg.sender);
    }

    // Update the address for a name
    function setAddress(string memory name, address newAddress) public {
        require(nameOwner[name] == msg.sender, "Not the owner of this name");
        records[name] = newAddress;
        emit RecordUpdated(name, newAddress);
    }

    // Transfer name ownership
    function transferName(string memory name, address newOwner) public {
        require(nameOwner[name] == msg.sender, "Not the owner of this name");
        require(newOwner != address(0), "Cannot transfer to zero address");
        nameOwner[name] = newOwner;
        emit NameTransferred(name, msg.sender, newOwner);
    }

    // Resolve name to address
    function resolve(string memory name) public view returns (address) {
        return records[name];
    }

    // Get the owner of a name
    function getOwner(string memory name) public view returns (address) {
        return nameOwner[name];
    }
}
