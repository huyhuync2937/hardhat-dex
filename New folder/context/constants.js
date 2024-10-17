import { ethers } from "ethers";
import web3Modal from "web3modal";

import ERC20ABI from "./abi.json";

export const ERC20_ABI = ERC20ABI 
export const V3_SWAP_ROUTER_ADDRESS =
  "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";

//TEST_ACCOUNT_FORK
const TEST_ACCOUNT = "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B";
const fetchTokenContract = (signer, ADDRESS) => {
  new ethers.Contract(ADDRESS, abi, signer);
}

export const web3Provider = async () => {
  try {
    const web3modal = new web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    //  const network = new ethers.network;
    return provider;

  } catch (error) {
    console.log(error);
  }
}

export const CONNECTING_CONTRACT = async (ADDRESS) => {
  try {
    // const TEST_ACCOUT = "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B";
    const provider = await web3Provider();
    const network = await provider.getNetWork();
    const signer = provider.getSigner();

    const contract = fetchTokenContract(signer, ADDRESS);

    //USER address

    // const userContract = await signer.getAddress();

    const balance = await contract.balanceOf(TEST_ACCOUT);
    const name = await contract.name();
    const symbol = await contract.symbol();
    const supply = await contract.supply();
    const decimals = await contract.decimals();
    const address = await contract.address();

    const token = {
      address: address,
      name: name,
      decimals: decimals,
      symbol: symbol,
      balance: ethers.utils.formatEther(balance.toString()),
      supply: ethers.utils.formatEther(supply.toString()),
      chainId:1
    }
    return token;
  } catch (error) {
    console.log(error);
  }
}