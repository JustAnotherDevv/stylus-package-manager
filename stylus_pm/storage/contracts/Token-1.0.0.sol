// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Token {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    constructor() {
        name = "Example Token";
        symbol = "ETK";
        decimals = 18;
        totalSupply = 1000000 * 10**uint256(decimals);
    }
}
