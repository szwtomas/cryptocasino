// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./CryptoCraps.sol";
import "./Randomizable.sol";
import "./CryptoGame.sol";

contract CryptoRoulette is CryptoGame, OnlyValidFunds {
    
    address private _casinoAddress; 

    constructor (address casinoAddress) {
        _casinoAddress = casinoAddress;

    }
    
    function playerPlayingRoulette() external view returns (bool) {
        return addressToBet[msg.sender] > 0;
    }
    
    function execute(uint256 randomNumber) override external{
        uint8 rolledNumber = uint8(randomNumber % 35);
        address winner = diceToAddress[diceNumber];
        casino.transfer(winner, currentBetValue * 4);
        currentPlayersCount = 0;
        for(uint8 i = 1; i <= 2; i++){
            addressToBet[diceToAddress[i]] = 0;
            diceToAddress[i] = address(0);
        }
        currentBetValue = 0;
        emit DiceRolled(winner, diceNumber);
    }
}
