import {assert, expect} from "chai";
import {Contract} from "ethers";
import {deployments, getNamedAccounts, network, ethers} from "hardhat";
import {developmentNetworks} from "../../helper-hardhat-config";

!developmentNetworks.includes(network.name)
  ? describe.skip
  : describe("FundMe Contract", function () {
      let deployer: string, fundMe: Contract, mockV3Aggregator: Contract;
      const sendValue = ethers.utils.parseEther("1");

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
      });

      // constructor tests frame
      describe("constructor", function () {
        it("sets the aggregator address correctly", async function () {
          const response = await fundMe.getPriceFeed();
          assert.equal(response, mockV3Aggregator.address);
        });
      });

      // fund function tests frame
      describe("Fund", function () {
        it("Fails if you don't send enough ETH", async () => {
          await expect(fundMe.fund()).to.be.reverted;
        });

        it("Updates the amount funded data structure", async () => {
          await fundMe.fund({value: sendValue});
          const amountFunded = await fundMe.getAddressToAmountFunded(deployer);
          assert.equal(amountFunded.toString(), sendValue.toString());
        });

        it("Adds funder to array of funders", async () => {
          await fundMe.fund({value: sendValue});
          const funder = await fundMe.getFunder(0);
          assert.equal(funder, deployer);
        });
      });

      describe("Withdraw", function () {
        beforeEach(async () => {
          await fundMe.fund({value: sendValue});
        });
        // it("Only allows the owner to withdraw", async () => {
        //   const accounts = await ethers.getSigners();
        //   const fundMeConnectedContract = fundMe.connect(accounts[1]);
        //   await expect(fundMeConnectedContract.withdraw()).to.be.revertedWith(
        //     "FundMe__NotOwner"
        //   );
        // });
      });
    });
