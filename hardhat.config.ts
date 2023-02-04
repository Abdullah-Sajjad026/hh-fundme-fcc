import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-ethers";
import "solidity-coverage";
import "hardhat-gas-reporter";
import "hardhat-deploy";
import "dotenv/config";

const LOCALHOST_RPC = process.env.LOCALHOST_RPC || "";
const LOCALHOST_ACCOUNT_PVT_KEY =
  process.env.LOCALHOST_ACCOUNT_PVT_KEY || "0xkey";
const GOERLI_RPC = process.env.GOERLI_RPC_URL || "kep";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key";
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "key";
const METAMASK_ACCOUNT_PVT_KEY =
  process.env.METAMASK_ACCOUNT_PVT_KEY || "0xkey";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.8",
      },
      {
        version: "0.6.6",
      },
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: LOCALHOST_RPC,
      accounts: [LOCALHOST_ACCOUNT_PVT_KEY],
      chainId: 31337,
    },
    hardhat: {
      chainId: 31337,
    },
    goerli: {
      url: GOERLI_RPC,
      accounts: [METAMASK_ACCOUNT_PVT_KEY],
      chainId: 5,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: false,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COINMARKETCAP_API_KEY,
    token: "MATIC",
  },
};

export default config;
