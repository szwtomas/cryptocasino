// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./CryptoCasino.sol";
import "./Randomizable.sol";

contract CryptoCraps is CryptoCasino {

    
    mapping(uint8 => address) private diceToAddress;
    mapping(address => uint256) private addressToBet;
    uint8 currentPlayersCount;
    uint256 public currentBetValue;
    
    constructor (address _randomizableContract) CryptoCasino(_randomizableContract){
        currentPlayersCount = 0;
    }

    //Single dice, user chooses number and get x5 
    
    function betNumberSingleDice(uint8 choice, uint256 bet) public onlyValidFunds(bet) {
        require(diceToAddress[choice] == address(0), "that dice choice has already been chosen");
        require(currentPlayersCount <= 6, "table is full. Come back later");
    
        if (currentPlayersCount <= 6){
            if(currentPlayersCount == 0){
                require(bet <= 100, "100 is the maximum amount of chips you can bet in this game");
                currentBetValue = bet;
            } else{
                require(bet == currentBetValue, "you have to bet currentBetValue");
            }
            addressToBet[msg.sender] = bet;
            diceToAddress[choice] = msg.sender;
            currentPlayersCount++;
            if(currentPlayersCount == 6){
                randomProviderContract.updateRandomNumber();
            }
        } 
    }
    
    function execute(uint256 randomNumber) external{
        uint8 diceNumber = uint8(randomNumber % 6 + 1);
        address winner = diceToAddress[diceNumber];
        chipContract.transfer(winner, currentBetValue * 4); // * 4 porque asi el casino se queda con el valor de 1 bet
        currentPlayersCount = 0;
        for(uint8 i = 1; i <= 6; i++){
            if(diceToAddress[i] != winner){
                chipContract.transferFrom(diceToAddress[i], address(this), currentBetValue);
            }
            diceToAddress[i] = address(0);
            
        }
    }
}
