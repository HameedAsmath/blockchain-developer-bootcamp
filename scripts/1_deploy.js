const hre = require("hardhat");

async function main() {
    //Fetch contract to deploy
   const Token = await hre.ethers.getContractFactory("Token") 

   //Deploy contract
   const token = await Token.deploy()
   await token.waitForDeployment()
   console.log(token)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
