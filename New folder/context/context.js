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

import { ERC20_ABI, CONNECTING_CONTRACT, web3Provider } from "./constants";
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

            const provider = await web3Provider();
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

    async function getPool(tokenA, tokenB, feeAmount, provider) {
        const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
        const poolAddress = Pool.getAddress(token0, token1, feeAmount);

        const contract = new ethers.Contrac(poolAddress, IUniswapV3Pool, provider);

        let liquidity = await contract.liquidity();
        let { sqrtPriceX96, tick } = await contract.slot0();

        liquidity = JSBI.BigInt(liquidity.toString());
        sqrtPriceX96 = JSBI.BigInt(sqrtPriceX96.toString());

        return new Pool(token0, token1, feeAmount, sqrtPriceX96, liquidity, tick, [
            {
                index: nearesUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[feeAmount]),
                liquidityNet: liquidity,
                liquidityGross: liquidity
            },
            {
                index: nearesUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[feeAmount]),
                liquidityNet: JSBI.multiply(liquidity, JSBI.BigInt("-1")),
                liquidityGross: liquidity
            }
        ])
    }

    function swapOption(option) {
        return Object.assign({
            slippageTolerance: new Percent(5, 1000),
            recipient: RECIPENT
        },
            option
        )
    }

    function buildTrade(trades) {
        return new RouterTrade({
            v2Routes: trades.filter((trade) => trade instanceof V2Trade)
                .map((trade) => ({
                    routev2: trade.route,
                    inputAmont: trade.inputAmont,
                    outputAmount: trade.outputAmoun
                })),
            v3Routes: trades.filter((trade) => trade instanceof V3Trade)
                .map((trade) => ({
                    routev3: trade.route,
                    inputAmont: trade.inputAmont,
                    outputAmount: trade.outputAmoun
                })),
            mixedRoutes: trades.filter((trade) => trade instanceof MixedRouteTrade)
                .map((trade) => ({
                    mixedRoute: trade.route,
                    inputAmont: trade.inputAmont,
                    outputAmount: trade.outputAmoun
                })),
            tradeType: trades[0].tradeType
        })
    }
    const RECIPENT = "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B";

    const swap = async (token_1, token_2, swapInputAmount) => {
        try {
            console.log("Calling me ____ swap")
            const _inputAmount = 1;
            const provider = web3Provider();
            const network = await provider.getNetWork();
            // const ETHER = Ether.onChain(network.chainID);
            const ETHER = Ether.onChain(1);

            const tokenAddress1 = await CONNECTING_CONTRACT("");
            const tokenAddress2 = await CONNECTING_CONTRACT("");

            const TOKEN_A = new Token(
                tokenAddress1.chainID,
                tokenAddress1.address,
                tokenAddress1.decimals,
                tokenAddress1.symbol,
                tokenAddress1.name
            )
            const TOKEN_B = new Token(
                tokenAddress2.chainID,
                tokenAddress2.address,
                tokenAddress2.decimals,
                tokenAddress2.symbol,
                tokenAddress2.name
            )

            const WETH_USDC_V3 = await getPool(
                TOKEN_A,
                TOKEN_B,
                FeeAmount.MEDIUM,
                provider
            )

            const inputEther = ethers.utils.parseEther("1").toString();
            const trade = await V3Trade.fromRoute(
                new RouteV3([WETH_USDC_V3], ETHER, TOKEN_B),
                CurrencyAmount.fromRawAmount(Ether, inputEther),
                TradeType.EXACT_INPUT
            );

            const routerTrade = buildTrade([trade]);
            const opts = swapOption({});

            const params = SwapRouter.swapERC20CallParameters(routerTrade, opts);

            console.log(WETH_USDC_V3);
            console.log(trade);
            console.log(routerTrade);
            console.log(opts);
            console.log(params);

            let ethBalance;
            let tokenA;
            let tokenB;

            ethBalance = await provider.getBalance(RECIPENT);
            tokenA = await tokenAddress1.balance;
            tokenB = await tokenAddress2.balance;

            console.log("-----------Before");
            console.log("ETH Balance: ", ethers.utils.formatUnits(ethBalance, 18));
            console.log("tokenA", tokenA);
            console.log("tokenB", tokenB);

            const tx = await signer.sendTransaction({
                data: params.calldata,
                to: "",
                value: params.value,
                from: RECIPENT
            })

            console.log("----CALLING ME");
            const receipt = await tx.wait();

            console.log("-----SUCCESS");
            console.log("STATUS", receipt.status)


            ethBalance = await provider.getBalance(RECIPENT);
            tokenA = await tokenAddress1.balance;
            tokenB = await tokenAddress2.balance;
            console.log("-----AFTER");


            console.log("ETH Balance: ", ethers.utils.formatUnits(ethBalance, 18));
            console.log("tokenA", tokenA);
            console.log("tokenB", tokenB);

        } catch (error) {
            const errorMsg = parseErrorMsg(error);
            notifyError(errorMsg);
            console.log(error);
        }
    }

    return (
        <CONTEXT.Provider value={{
            TOKEN_SWAP, LOAD_TOKEN, notifyError, notifySuccess,
            setLoader, loader, connect, address, swap
        }}>
            {children}
        </CONTEXT.Provider>
    )
}
