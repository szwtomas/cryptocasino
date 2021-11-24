// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./CryptoCasino.sol";
import "./Randomizable.sol";
import "./OnlyValidFunds.sol";
import "./CryptoCasinoInterface.sol";
import "./CryptoGame.sol";

contract CryptoCraps is CryptoGame, OnlyValidFunds {

    mapping(uint8 => address) internal diceToAddress;
    mapping(address => uint256) internal addressToBet;
    uint8 public currentPlayersCount;
    uint256 public currentBetValue;

    event DiceRolled(address winnerAddress, uint8 diceNumber);
    event PlayerAdded(uint8 currentPlayersCount);
    
    CryptoCasinoInterface casino;

    constructor (address casinoAddress){
        casino = CryptoCasinoInterface(casinoAddress);
    }
    
    function playerPlayingDice() external view returns (bool) {
        return addressToBet[msg.sender] > 0;
    }

    function betNumberSingleDice(uint8 choice, uint256 bet) public onlyValidFunds(bet) {
        require(diceToAddress[choice] == address(0), "that dice choice has already been chosen");
        require(currentPlayersCount <= 2, "table is full. Come back later");
    
        if (currentPlayersCount <= 2){
            if(currentPlayersCount == 0){
                require(bet <= 200, "100 is the maximum amount of chips you can bet in this game");
                currentBetValue = bet;
            } else{
                require(bet == currentBetValue, "you have to bet currentBetValue");
            }
            casino.transferFrom(msg.sender, bet);
            //chipContract.transferFrom(msg.sender, address(this), bet);
            addressToBet[msg.sender] = bet;
            diceToAddress[choice] = msg.sender;
            currentPlayersCount++;
            if(currentPlayersCount == 2){
                casino.updateRandomNumber();
            }
        } 
        emit PlayerAdded(currentPlayersCount);
    }
    
    function execute(uint256 randomNumber) external{
        uint8 diceNumber = uint8(randomNumber % 2 + 1);
        address winner = diceToAddress[diceNumber];
        casino.transfer(winner, currentBetValue * 4);
        //chipContract.transfer(winner, currentBetValue * 4); // * 4 porque asi el casino se queda con el valor de 1 bet
        currentPlayersCount = 0;
        for(uint8 i = 1; i <= 2; i++){
            addressToBet[diceToAddress[i]] = 0;
            diceToAddress[i] = address(0);
        }
        currentBetValue = 0;
        emit DiceRolled(winner, diceNumber);
    }
}
