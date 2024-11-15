import React, { useState } from "react";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import JSBI from "jsbi";
import Web3Modal from "web3modal";

import { SwapRouter } from "@uniswap/universal-router-sdk";
import { TradeType, Ether, Token, CurrencyAmount, Percent } from "@uniswap/sdk-core";
import { Trade as V2Trade } from "@uniswap/v2-sdk";
import { Pool, nearesUsableTick, TickMath, TICK_SPACINGS, FeeAmount, Trade as V3Trade, Route as RouteV3 } from "@uniswap/v3-sdk";
import { MixedRouteTrade, Trade as RouterTrade } from "@uniswap/router-sdk";
import IUniswapV3Pool from "@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json";

import { ERC20_ABI, CONNECTING_CONTRACT, web3Provider, poolFactoryContract, poolContract, USDContract, tokenContract } from "./constants";
import { shortenAddress, parseErrorMsg } from "../utils/index";

export const CONTEXT = React.createContext();

export const PROVIDER = ({ children }) => {
    const TOKEN_SWAP = "TOKEN SWAP DAPP";
    const [loader, setLoader] = useState(false);
    const [address, setAddress] = useState("");
    const [chainID, setChainID] = useState();
    // const { ethereum } = window;

    const notifyError = (msg) => toast.error(msg, { duration: 4000 });
    const notifySuccess = (msg) => toast.success(msg, { duration: 4000 });


    const connect = async () => {
        try {
            if (!window.ethereum) return notifyError("Install Metamask");
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
            window.ethereum.on("accounts changed", () => {
                window.location.reload();
            });
            if (accounts.length) {
                setAddress(accounts[0]);
            }
            else {
                notifyError("Sorry, you have np account")
            }


            // contract.createPool("0xB068E31035DE8fd41C5AEE3453D20aD95c60463c","0x8b05d9CC2ee540fA8876520C526c6225d50897f4",4);
            // const network = await provider.getNetWork();
            // setChainID(network.chainID);
        } catch (error) {
            const errorMsg = parseErrorMsg(error);
            notifyError(errorMsg);
            console.log(error);
        }
    }

    const LOAD_TOKEN = async (token) => {
        try {
            const tokenDetail = await CONNECTING_CONTRACT(token);
            return tokenDetail;
        } catch (error) {
            const errorMsg = parseErrorMsg(error);
            notifyError(errorMsg);
            console.log(error);
        }
    }

    async function getPool() {

        const provider = await web3Provider();
        const signer = provider.getSigner();

        const contractPool = await poolContract(signer);
        const contractToken = await tokenContract(signer);
        const contractUSD = await USDContract(signer);

        contractUSD.approve((await poolContract()).address, 1000);

        contractToken.approve((await poolContract()).address, 1000);

        const amount0 = 9;
        const amount1 = 9;

        const tx = contractPool.addLiquidity(
            ethers.utils.parseUnits(amount0.toString(), 18),
            ethers.utils.parseUnits(amount1.toString(), 18)
        );

        console.log(tx);
       

    }
    async function swap(address, amount){


        try {
            const provider = await web3Provider();
            const signer = provider.getSigner();
    
            // Kiểm tra xem người dùng đã kết nối ví chưa
            if (!signer) {
                throw new Error("Please connect your wallet first");
            }
    
            const contractPool = await poolContract(signer);
    
            // Kiểm tra xem địa chỉ token và số lượng có hợp lệ không
            if (!ethers.utils.isAddress(address)) {
                throw new Error("Invalid token address");
            }
            if (isNaN(amount) || amount <= 0) {
                throw new Error("Invalid amount");
            }
    
            // Kiểm tra số dư của người dùng
            const balance = await signer.getBalance();
            if (balance.lt(ethers.utils.parseUnits(amount, 18))) {
                throw new Error("Insufficient balance");
            }
    
            // Thực hiện swap
            const tx = await contractPool.swap(address, ethers.utils.parseUnits(amount, 18), {
                gasLimit: 300000 // Đặt gasLimit để tránh lỗi out of gas
            });
    
            // Đợi transaction được xác nhận
            const receipt = await tx.wait();
    
            console.log("Swap successful:", receipt);
            notifySuccess("Swap completed successfully");
    
            return receipt;
        } catch (error) {
            console.error("Swap error:", error);
            const errorMsg = parseErrorMsg(error);
            notifyError(errorMsg || "An error occurred during the swap");
            throw error;
        }
    }


    return (
        <CONTEXT.Provider value={{
            TOKEN_SWAP, LOAD_TOKEN, notifyError, notifySuccess,
            setLoader, loader, connect, address, getPool , swap
        }}>
            {children}
        </CONTEXT.Provider>
    )
}
