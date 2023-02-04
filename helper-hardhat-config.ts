import "dotenv/config";

export const networksConfig = {
  5: {
    name: "goerli",
    ethUsdPriceFeed: process.env.GOERLI_ETHUSD_PRICEFEED_ADDRESS || "",
  },
};

export const developmentNetworks = ["localhost", "hardhat"];

export const DECIMALS = 8;
export const INITIAL_ANSWER = 20000000000;
