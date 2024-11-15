
import { ethers } from "ethers";
export default class BaseInterface {
  _provider;
  _contractAddress;
  _abis;
  _contract;
  _option;

  constructor(
    provider,
    address,
    abi
  ) {
    this._provider = provider;
    this._contractAddress = address;
    this._abis = abi;
    this._option = { gasLimit: 1000000 };
    this._contract = new ethers.Contract(address, abi, provider);
  }

  _handleTransactionResponse = async (tx) => {
    const recept = await tx.wait();
    return recept.transactionHash;
  }

  _numberToEth = (amount) => {
    return ethers.parseEther(amount.toString());
  }

  toNumber = (bigNumber) => {
    // try {
    //   return bigNumber.toNumber();
    // } catch (er) {
      return ethers.utils.formatUnits(bigNumber);
    // }
  };

  _toEther = (bigNumber) => {
    return Number.parseFloat(ethers.utils.formatUnits(bigNumber));
  }

  _toWei = (amount) => {
    return ethers.parseUnits(amount.toString());
  };
}