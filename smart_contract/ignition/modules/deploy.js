const { ethers } = require("hardhat");
const fs = require('fs');
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
async function main() {


    let contractAddresses = '';

    const logDeployment = (contractName, target) => {
        contractAddresses += `export const ${contractName}Address = '${target}';\n`;
    };


    const USDTContract = await ethers.getContractFactory("USD");
    const usdtContract = await USDTContract.deploy();
    await usdtContract.waitForDeployment();
    const tx1 = await usdtContract.deploymentTransaction();
    logDeployment("USD", usdtContract.target);
    //-------------------------------------------------------------------
    const TokenContract = await ethers.getContractFactory("Token");
    const tokenContract = await TokenContract.deploy();
    await tokenContract.waitForDeployment();
    const tx2 = await tokenContract.deploymentTransaction();
    logDeployment("Token", tokenContract.target);
    //-------------------------------------------------------------------
    const VaultContract = await ethers.getContractFactory("Vault");
    const vaultContract = await VaultContract.deploy(ethers.getAddress("0xa2ECABf09d51FE3FfAaA07e7951D62517B9d0F67"));
    await vaultContract.waitForDeployment();
    const tx3 = await vaultContract.deploymentTransaction();
    logDeployment("Vault", vaultContract.target);
    //-------------------------------------------------------------------
    const PoolContract = await ethers.getContractFactory("Pool");
    const poolContract = await PoolContract.deploy(
        ethers.getAddress("0x1971BBe25F36Deea8999250a92DF8Fa2fFA841Ea"),
        ethers.getAddress("0xaB8f4Ffe38173970FcF813D860a9fc8B9FA12201"),
        2);
    await poolContract.waitForDeployment();
    const tx4 = await poolContract.deploymentTransaction();
    logDeployment("Pool", poolContract.target);
    // //-------------------------------------------------------------------
    const PoolFactoryContract = await ethers.getContractFactory("PoolFactory");
    const poolFactoryContract = await PoolFactoryContract.deploy();
    await poolFactoryContract.waitForDeployment();
    const tx5 = await poolFactoryContract.deploymentTransaction();
    logDeployment("PoolFactory", poolFactoryContract.target);
    //-------------------------------------------------------------------
    // const LiquidityTokenContract = await ethers.getContractFactory("LiquidityToken");
    // const liquidityTokenContract = await LiquidityTokenContract.deploy();
    // await liquidityTokenContract.waitForDeployment();
    // const tx6 = await liquidityTokenContract.deploymentTransaction();
    // logDeployment(" LiquidityToken", liquidityTokenContract.target);



    fs.appendFileSync('D:/blockchain/Dex/smart_contract/contractsAddress.js', contractAddresses);
    console.log('Contract addresses saved to contractsAddress.js');

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });