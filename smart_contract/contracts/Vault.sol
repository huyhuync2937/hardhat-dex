//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.2 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Vault is Ownable, AccessControl {
    IERC20 private token;
    uint256 public maxWithDrawAmount;
    bool public withDrawEnable;
    bytes32 public constant WITHDRAWER_ROLE = keccak256("WITHDRAWER_ROLE");

    function setWithdrawEnable(bool _isEnable) public onlyOwner {
        withDrawEnable = _isEnable;
    }

    function setMaxWithdrawAmount(uint256 _maxAmount) public onlyOwner {
        maxWithDrawAmount = _maxAmount;
    }

    function setToken(IERC20 _token) public onlyOwner {
        token = _token;
    }

    constructor(address initialOwner)  Ownable(initialOwner) AccessControl() {
        _grantRole(DEFAULT_ADMIN_ROLE,initialOwner);
    }

    function  withdraw(uint256 _amount, address _to)  external onlyWithdraw {
        require(withDrawEnable, "withDrawEnable is not available");
        require(_amount <= maxWithDrawAmount, "Exceed maximum amount");

        token.transfer(_to, _amount);
    }

    function deposit(uint256 _amount) external{
        require(token.balanceOf(msg.sender) >= _amount, 
        "Insufficient account balance");

        SafeERC20.safeTransferFrom(token, msg.sender, address(this), _amount);
    }

    modifier onlyWithdraw(){
        require(owner() == _msgSender() || hasRole(WITHDRAWER_ROLE,_msgSender()));
        _;
    }
}