import {network} from "hardhat";
import {DeployFunction} from "hardhat-deploy/dist/types";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {
  developmentNetworks,
  DECIMALS,
  INITIAL_ANSWER,
} from "../helper-hardhat-config";

const deployMocks: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  if (developmentNetworks.includes(network.name)) {
    const {deployments, getNamedAccounts} = hre;

    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();

    log("Local network detected. Deploying mocks ...");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      log: true,
      from: deployer,
      args: [DECIMALS, INITIAL_ANSWER],
    });
    log("Mocks deployed!");
    log("----------------------------------------");
  }
};

export default deployMocks;
deployMocks.tags = ["all", "mocks"];
