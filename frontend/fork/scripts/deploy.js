const { SwapRouter } = require("@uniswap/universal-router-sdk");
const { TradeType, Ether, Token, CurrencyAmount, Percent } = require("@uniswap/sdk-core");
const { Trade:V2Trade  } = require ("@uniswap/v2-sdk");
const { Pool, nearesUsableTick, TickMath, TICK_SPACINGS, FeeAmount, Trade:V3Trade , Route:RouteV3  } = require("@uniswap/v3-sdk");
const { MixedRouteTrade, Trade:RouterTrade } = require("@uniswap/router-sdk");
const IUniswapV3Pool = require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json");

const JSBI = require("jsbi");
const erc20Abi = require("../abis__erc20.json");
const hardhat = require("hardhat");
const provider = hardhat.ethers.provider;

const ETHER = Ether.onChain(1);
const WETH = new Token(
    1,
    " ",
    18,
    "WETH",
    "Wrapped Ether"
);
const USDT = new Token(
    1,
    "0xdac17f958d2ee523a2206206994597c13d831ec7",
    6,
    "USDT",
    "Tether"
);
const wethContract = new hardhat.ethers.Contract(WETH.address, erc20Abi, provider);
const usdtContract = new hardhat.ethers.Contract(USDT.address, erc20Abi, provider);

async function getPool(tokenA, tokenB, feeAmount) {
    const [token0, token1] = tokenA.sortsBefore(tokenB)
        ? [tokenA, tokenB]
        : [tokenB, tokenA]
        ;

    const poolAddress = Pool.getAddress(token0, token1, feeAmount);

    const contract = new hardhat.ethers.Contract(
        poolAddress,
        IUniswapV3Pool.abi,
        provider
    );

    
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
            index: nearesUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[feeAmount]),
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

async function main() {
    const signer = await hardhat.ethers.getImpersonatedSigner(RECIPENT);

    const WETH_USDC_V3 = await getPool(WETH, USDT, FeeAmount.MEDIUM);

    const inputEther = hardhat.ethers.utils.parseEther("10").toString();

    const trade = await V3Trade.fromRoute(new RouteV3([WETH_USDC_V3], ETHER, USDT),
        CurrencyAmount.fromRawAmount(ETHER, inputEther),
        TradeType.EXACT_INPUT
    )

    const routerTrade = buildTrade([trade]);

    const opts = swapOption({});

    const params = SwapRouter.swapERC20CallParameters(routerTrade, opts);

    let ethBalance;
    let wethBalance;
    let usdtBalance;

    ethBalance = await provider.getBalance(RECIPENT);
    wethBalance = await wethContract.balanceOf(RECIPENT);
    usdtBalance = await usdtContract.balanceOf(RECIPENT);

    console.log("--Before");
    console.log("ethBalance", hardhat.ethers.utils.formatUnits(ethBalance, 18));
    console.log("wethBalance", hardhat.ethers.utils.formatUnits(wethBalance, 18));
    console.log("usdtBalance", hardhat.ethers.utils.formatUnits(usdtBalance, 18));

    const tx = await signer.sendTransaction({
        data: params.calldata,
        to: "",
        value: params.value,
        from: RECIPENT
    })
    const receipt = await tx.wait();

    console.log("-----SUCCESS");
    console.log("STATUS", receipt.status)

    console.log(WETH_USDC_V3);
    console.log(trade);
    console.log(routerTrade);
    console.log(opts);
    console.log(params);

    ethBalance = await provider.getBalance(RECIPENT);
    wethBalance = await wethContract.balanceOf(RECIPENT);
    usdtBalance = await usdtContract.balanceOf(RECIPENT);

    console.log("--After");
    console.log("ethBalance", hardhat.ethers.utils.formatUnits(ethBalance, 18));
    console.log("wethBalance", hardhat.ethers.utils.formatUnits(wethBalance, 18));
    console.log("usdtBalance", hardhat.ethers.utils.formatUnits(usdtBalance, 18));
}

main()
.then(()=>process.exit(0)).catch((error) =>{
    console.log(error);
    process.exit(1);
})