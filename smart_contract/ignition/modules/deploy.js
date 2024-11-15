const { ethers } = require("hardhat");
const fs = require('fs');
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
async function main() {


    let contractAddresses = '';

    const logDeployment = (contractName, target) => {
        contractAddresses += `export const ${contractName}Address = '${target}';\n`;
    };


    const ETHWContract = await ethers.getContractFactory("ETHW");
    const ethwContract = await ETHWContract.deploy();
    await ethwContract.waitForDeployment();
    const tx1 = await ethwContract.deploymentTransaction();
    logDeployment("ETHW", ethwContract.target);
    // //-------------------------------------------------------------------
    // const TokenContract = await ethers.getContractFactory("Token");
    // const tokenContract = await TokenContract.deploy();
    // await tokenContract.waitForDeployment();
    // const tx2 = await tokenContract.deploymentTransaction();
    // logDeployment("Token", tokenContract.target);
    // //-------------------------------------------------------------------
    // const VaultContract = await ethers.getContractFactory("Vault");
    // const vaultContract = await VaultContract.deploy(ethers.getAddress("0xa2ECABf09d51FE3FfAaA07e7951D62517B9d0F67"));
    // await vaultContract.waitForDeployment();
    // const tx3 = await vaultContract.deploymentTransaction();
    // logDeployment("Vault", vaultContract.target);
    // //-------------------------------------------------------------------
    // const PoolContract = await ethers.getContractFactory("Pool");
    // const poolContract = await PoolContract.deploy(
    //     ethers.getAddress("0x6F187e82db876Cbf8f5AcfE1F3698DFc4f888334"),
    //     ethers.getAddress("0xA902F5e3235E06e5fCb10877A67d91d6B47Fa935"),
    //     2);
    // await poolContract.waitForDeployment();
    // const tx4 = await poolContract.deploymentTransaction();
    // logDeployment("Pool", poolContract.target);
    // // //-------------------------------------------------------------------
    // const PoolFactoryContract = await ethers.getContractFactory("PoolFactory");
    // const poolFactoryContract = await PoolFactoryContract.deploy();
    // await poolFactoryContract.waitForDeployment();
    // const tx5 = await poolFactoryContract.deploymentTransaction();
    // logDeployment("PoolFactory", poolFactoryContract.target);
    //-------------------------------------------------------------------
    // const LiquidityTokenContract = await ethers.getContractFactory("LiquidityToken");
    // const liquidityTokenContract = await LiquidityTokenContract.deploy();
    // await liquidityTokenContract.waitForDeployment();
    // const tx6 = await liquidityTokenContract.deploymentTransaction();
    // logDeployment(" LiquidityToken", liquidityTokenContract.target);

    // const createPool = async (tokenAAddress, tokenBAddress, feeAmount) => {
    //     const fee = 50;
    //     const createPoolTx = await poolFactoryContract.createPool(tokenAAddress, tokenBAddress, fee);
    //     await createPoolTx.wait();
    //     return createPoolTx;
    //   };
    
    //   const pool1 = await createPool("0xB068E31035DE8fd41C5AEE3453D20aD95c60463c", "0x8b05d9CC2ee540fA8876520C526c6225d50897f4", 50)
    //   console.log("pool1: ", pool1)


    fs.appendFileSync('D:/blockchain/Dex/smart_contract/contractsAddress.js', contractAddresses);
    console.log('Contract addresses saved to contractsAddress.js');

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });