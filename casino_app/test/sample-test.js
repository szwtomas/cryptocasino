const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});

describe("CryptoCasino", function () {
  it("Should buy 50 tokens if msg.value = 0,5", async function () {

    const RandomnessOracle = await hre.ethers.getContractFactory("RandomnessOracle");
    const rO = await RandomnessOracle.deploy();
    await rO.deployed();

    const Randomizable = await hre.ethers.getContractFactory("Randomizable");
    const r = await Randomizable.deploy(rO.address);
    await r.deployed();

    const CryptoCasino = await ethers.getContractFactory("CryptoCasino");
    const cc = await CryptoCasino.deploy(r.address);
    await cc.deployed();

    expect(await cc.balance()).to.equal(0);

    await cc.buy({value: ethers.utils.parseEther("0.5")});

    expect(await cc.balance()).to.equal(50);

    await cc.sell(10);

    expect(await cc.balance()).to.equal(40);

    await expect(cc.sell(41)).to.be.revertedWith(
      "Not enough tokens"
    );

  });
  it("Should revert the transaction", async function () {

    const RandomnessOracle = await hre.ethers.getContractFactory("RandomnessOracle");
    const rO = await RandomnessOracle.deploy();
    await rO.deployed();

    const Randomizable = await hre.ethers.getContractFactory("Randomizable");
    const r = await Randomizable.deploy(rO.address);
    await r.deployed();

    const CryptoCasino = await ethers.getContractFactory("CryptoCasino");
    const cc = await CryptoCasino.deploy(r.address);
    await cc.deployed();

    await expect(cc.buy({value: ethers.utils.parseEther("10.01")})).to.be.revertedWith(
      "Not enough tokens in the reserve"
    );
  });
});
