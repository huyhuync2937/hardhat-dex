// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LiquidityToken is ERC20 {
    // constructor(string memory name, string memory symbol) ERC20(name, symbol) {}
    address public pool;

    constructor(address tokenA, address tokenB) 
        ERC20(string(abi.encodePacked("LP-", IERC20Metadata(tokenA).symbol(), "-", IERC20Metadata(tokenB).symbol())),
              string(abi.encodePacked("LP-", IERC20Metadata(tokenA).symbol(), IERC20Metadata(tokenB).symbol()))) {
        pool = msg.sender; // Người tạo hợp đồng LP token là pool
    }

    // Chỉ pool mới có thể mint token LP
    function mint(address to, uint256 amount) external {
        require(msg.sender == pool, "Only pool can mint");
        _mint(to, amount);
    }

    // Chỉ pool mới có thể burn token LP
    function burn(address from, uint256 amount) external {
        require(msg.sender == pool, "Only pool can burn");
        _burn(from, amount);
    }
}