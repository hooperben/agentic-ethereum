// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Afbap is AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant AGENT_ROLE = keccak256("AGENT_ROLE");

    // Mapping of token => owner => recipient => amount
    mapping(address => mapping(address => mapping(address => uint256)))
        public deposits;

    event Deposited(
        address indexed token,
        address indexed owner,
        address indexed recipient,
        uint256 amount
    );
    event Withdrawn(
        address indexed token,
        address indexed owner,
        address indexed recipient,
        uint256 amount
    );
    event BatchExecuted(
        address indexed agent,
        address indexed owner,
        address[] tokens,
        address[] recipients,
        uint256[] amounts
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function deposit(
        address token,
        address recipient,
        uint256 amount
    ) external {
        require(token != address(0), "Invalid token address");
        require(recipient != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than 0");

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        deposits[token][msg.sender][recipient] += amount;

        emit Deposited(token, msg.sender, recipient, amount);
    }

    function withdraw(address token, address owner, uint256 amount) external {
        require(msg.sender == owner, "Only owner can withdraw");
        require(
            deposits[token][owner][msg.sender] >= amount,
            "Insufficient balance"
        );

        deposits[token][owner][msg.sender] -= amount;
        IERC20(token).safeTransfer(msg.sender, amount);

        emit Withdrawn(token, owner, msg.sender, amount);
    }

    // TODO user signatures need to be passed and validated here
    function executeBatch(
        address owner,
        address[] calldata tokens,
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external onlyRole(AGENT_ROLE) {
        require(
            tokens.length == recipients.length &&
                tokens.length == amounts.length,
            "Array lengths must match"
        );

        for (uint256 i = 0; i < tokens.length; i++) {
            require(
                deposits[tokens[i]][owner][recipients[i]] >= amounts[i],
                "Insufficient balance"
            );

            deposits[tokens[i]][owner][recipients[i]] -= amounts[i];
            IERC20(tokens[i]).safeTransfer(recipients[i], amounts[i]);
        }

        emit BatchExecuted(msg.sender, owner, tokens, recipients, amounts);
    }
}
