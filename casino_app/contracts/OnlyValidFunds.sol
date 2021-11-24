pragma solidity ^0.8.0;

contract OnlyValidFunds {

    modifier onlyValidFunds(uint256 amount){
        require(amount > 0, "You need to bet at least one chip");
        uint playerChips = chipContract.balanceOf(msg.sender);
        require(amount <= playerChips, "Not enough funds to bet that amount"); 
        _;
    }

}