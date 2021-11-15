pragma solidity ^0.8.0;

import "./CryptoCasino.sol";
import "./Randomizable.sol";

contract CryptoCraps is CryptoCasino {

    constructor (address _oracleAddress) CryptoCasino(_oracleAddress){}

    //Single dice, user chooses number and get x5 
    //TODO: agregar onlyValidFunds(bet)(modifier)
    function betNumberSingleDice(uint8 choice, uint256 bet) public onlyValidFunds(bet) returns (uint256) {
        updateRandomNumber();
        if (choice == randomNumber) {
            //TODO: Mintear si no tenemos suficientes chips
            chipContract.transfer(msg.sender, bet * 5);
        } else {
            chipContract.transferFrom(msg.sender, address(this) ,bet);
        }
    }
}
