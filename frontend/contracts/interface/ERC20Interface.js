import {ethers} from 'ethers';
import BaseInterface from './BaseInterface';

class Erc20 extends BaseInterface { 
  constructor(provider, address, abi) {
      super(provider, address, abi)  
  }

  async balanceOf(walletAddress) {
    const balance = await this._contract.balanceOf(walletAddress);    
    return ethers.utils.formatUnits(balance);
  }

  async owner() {
    return this._contract.owner();
  }

  async totalSupply() {
    const total = await this._contract.totalSupply();
    return this._toNumber(total);
  }

  async name() {
    return this._contract.name();
  }

  async decimals(){
    return this._contract.decimals();
  }

  async symbol() {
    return this._contract.symbol();
  }

  async approve(address, amount) {
    // const wei = ethers.parseUnits(amount.toString());
    await this._contract.approve(address, amount);
  }
}

export default Erc20;