require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    testnet: {
      url: process.env.RPC_URL,
      accounts: [process.env.YOUR_PRIVATE_KEY],
    }
  }
  // ,
  // etherscan: {
  //   apiKey:process.env.ETHERSCAN_API_KEY

  // },
};
