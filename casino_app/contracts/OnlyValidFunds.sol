// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract OnlyValidFunds {

    modifier onlyValidFunds(uint256 amount, uint256 balance){
        require(amount > 0, "You need to bet at least one chip");
        require(amount <= balance, "Not enough funds to bet that amount"); 
        _;
    }

}