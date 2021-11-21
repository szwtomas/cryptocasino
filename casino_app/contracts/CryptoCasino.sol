// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Randomizable.sol";
import "./Ownable.sol";
import "./CryptoChip.sol";
import "./IERC20.sol";

//crypto casino game tal vez es un mejor nombre
contract CryptoCasino is Ownable {

    IERC20 internal chipContract;
    RandomizableInterface internal randomProviderContract; 

    event Bought(uint256 amount);
    event Sold(uint256 amount);

    constructor  (address _randomizableContract) {
        chipContract = new CryptoChip("Crypto Chip", "CHIP", 1000, address(this));
        randomProviderContract = RandomizableInterface(_randomizableContract);
    }

    function buy() public payable {
        uint256 amountToBuy = msg.value;
        //uint256 resto = amountToBuy % 10000000000000000;
        amountToBuy = amountToBuy / 10000000000000000; //0,01
        uint256 chipCount = chipContract.balanceOf(address(this));
        require(amountToBuy > 0, "You need to send some ether");
        require(amountToBuy <= chipCount, "Not enough tokens in the reserve");
        chipContract.transfer(msg.sender, amountToBuy);
        emit Bought(amountToBuy);
    }

    function sell(uint256 amount) public {
        require(amount > 0, "You need to sell at least some tokens");
        uint256 allowance = chipContract.allowance(msg.sender, address(this));
        require(allowance >= amount, "Not enough tokens");
        chipContract.transferFrom(msg.sender, address(this), amount);
        payable(msg.sender).transfer(amount * 10000000000000000);
        emit Sold(amount);
    }

    function balance() public view returns (uint256) {
        return chipContract.balanceOf(msg.sender);
    }

    function setChipContractAddress(address _address) external onlyOwner {
        chipContract = IERC20(_address);
    }

    modifier onlyValidFunds(uint256 amount) {
        require(amount > 0, "You need to bet at least one chip");
        uint playerChips = chipContract.balanceOf(msg.sender);
        require(amount <= playerChips, "Not enough funds to bet that amount"); 
        _;
    }

}