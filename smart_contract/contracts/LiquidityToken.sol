// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LiquidityToken is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}
}