// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  await hre.run('compile');
  const RandomnessOracle = await hre.ethers.getContractFactory("RandomnessOracle");
  const rO = await RandomnessOracle.deploy();
  await rO.deployed();

  const Randomizable = await hre.ethers.getContractFactory("Randomizable");
  const r = await Randomizable.deploy(rO.address);
  await r.deployed();

  const CryptoCasino = await hre.ethers.getContractFactory("CryptoCasino");
  const cc = await CryptoCasino.deploy(r.address);
  await cc.deployed();

  const CryptoCraps = await hre.ethers.getContractFactory("CryptoCraps");
  const ccr = await CryptoCraps.deploy(cc.address);
  await ccr.deployed();

  const CryptoRoulette = await hre.ethers.getContractFactory("CryptoRoulette");
  const crr = await CryptoRoulette.deploy(cc.address);
  await crr.deployed();


  cc.addGame(ccr.address);
  cc.addGame(crr.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
