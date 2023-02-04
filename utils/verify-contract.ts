import * as hre from "hardhat";

const verifyContract = async function (contractAddress: string, args: any[]) {
  console.log("Verifying deployed contract ...");
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (error: any) {
    if (error.message.toLowerCase().includes("already verified"))
      console.log("Already Verified");
    else console.log(error);
  }
};
export {verifyContract};
