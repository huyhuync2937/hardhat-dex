// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ETHW is ERC20  {

    uint256 private initialSupply = 50_000_000_000 * 10 ** uint256(18);
    constructor() ERC20("Ether", "ETHW") {
        _mint(msg.sender, initialSupply);
    }
    
}