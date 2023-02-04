import {network} from "hardhat";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {developmentNetworks, networksConfig} from "../helper-hardhat-config";
import {verifyContract} from "../utils/verify-contract";

async function deployFunc(hre: HardhatRuntimeEnvironment) {
  const {getNamedAccounts, deployments} = hre;

  const {deploy, log} = deployments;
  const {deployer} = await getNamedAccounts();
  const chainId = network.config.chainId!;

  let ethUsdPriceFeedAddress;
  if (developmentNetworks.includes(network.name)) {
    const mockV3Aggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = mockV3Aggregator.address;
  } else {
    //   @ts-ignore
    ethUsdPriceFeedAddress = networksConfig[chainId]?.[
      "ethUsdPriceFeed"
    ] as string;
  }

  const fundMeArgs = [ethUsdPriceFeedAddress];

  const fundMe = await deploy("FundMe", {
    from: deployer,
    log: true,
    args: fundMeArgs,
    waitConfirmations: !developmentNetworks.includes(network.name) ? 5 : 0,
  });

  if (
    !developmentNetworks.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verifyContract(fundMe.address, fundMeArgs);
  }

  log("---------------------------------------");
}

export default deployFunc;
deployFunc.tags = ["all", "fundme"];
