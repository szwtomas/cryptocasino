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
    const CryptoCasino = await ethers.getContractFactory("CryptoCasino");
    const cc = await CryptoCasino.deploy();
    await cc.deployed();

    const CryptoChip = await ethers.getContractFactory("CryptoChip");
    const cryptoChip = await CryptoChip.deploy("CryptoChip", "CCP", 1000, cc.address);
    await cryptoChip.deployed();

    await cc.setChipContractAddress(cryptoChip.address);

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
    const CryptoCasino = await ethers.getContractFactory("CryptoCasino");
    const cc = await CryptoCasino.deploy();
    await cc.deployed();

    const CryptoChip = await ethers.getContractFactory("CryptoChip");
    const cryptoChip = await CryptoChip.deploy("CryptoChip", "CCP", 1000, cc.address);
    await cryptoChip.deployed();

    await cc.setChipContractAddress(cryptoChip.address);

    await expect(cc.buy({value: ethers.utils.parseEther("10.01")})).to.be.revertedWith(
      "Not enough tokens in the reserve"
    );
  });
});
