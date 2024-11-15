import { Contract, ethers } from "ethers";
import web3Modal from "web3modal";
import Erc20 from "../contracts/interface/ERC20Interface";
import { getUSDAbi, getPoolAbi, getTokenAbi, getPoolFactoryAbi, getVaultAbi, getETHWAbi } from "../contracts/utils/Abi";
import { getRPC, SMART_ADDRESS } from "../contracts/utils/Common";


const provider = new ethers.providers.JsonRpcProvider(getRPC());
const TEST_ACCOUT = "0x6466CC6Bec1bf476Ab85743d9b27f1dDb6B3b321";


export const web3Provider = async () => {
  try {
    const web3modal = new web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    return provider;

  } catch (error) {
    console.log(error);
  }
}

export const poolFactoryContract = async (signer) => {
  const contract = new Contract(SMART_ADDRESS.PoolFactoryAddress, getPoolFactoryAbi(), signer);
  return contract;

}
export const poolContract = async (signer) => {
  const contract = new Contract(SMART_ADDRESS.PoolAddress, getPoolAbi(),signer);
  return contract;

}
export const USDContract = async (signer) => {
  const contract = new Erc20(signer, SMART_ADDRESS.USDAddress, getUSDAbi());
  return contract;

}
export const tokenContract = async (signer) => {
  const contract = new Erc20(signer, SMART_ADDRESS.TokenAddress, getTokenAbi());
  return contract;

}
export const ethwContract = async (signer) => {
  const contract = new Erc20(signer, SMART_ADDRESS.ETHWAddress, getETHWAbi());
  return contract;

}

export const CONNECTING_CONTRACT = async (ADDRESS) => {
  try {
    let contract = null;
    if (ADDRESS === SMART_ADDRESS.USDAddress) {
      contract = await USDContract(provider);
    }
    if (ADDRESS === SMART_ADDRESS.TokenAddress) {
      contract = await tokenContract(provider);
    }
    if (ADDRESS === SMART_ADDRESS.ETHWAddress) {
      contract = await ethwContract(provider);
    }

    const balance = await contract.balanceOf(TEST_ACCOUT);
    const name = await contract.name();
    const symbol = await contract.symbol();
    // const supply = await contract.totalSupply();
    const decimals = await contract.decimals();
    // const address = await contract.address();

    const token = {
      address: ADDRESS,
      name: name,
      decimals: decimals,
      symbol: symbol,
      balance: balance,
      // supply: supply,
      // chainId:1
    }
    console.log(token);

    return token;
  } catch (error) {
    console.log(error);
  }
}