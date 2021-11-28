// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./CryptoCraps.sol";
import "./Randomizable.sol";
import "./CryptoGame.sol";

contract CryptoRoulette is CryptoGame, OnlyValidFunds {
    
    //TODO: Ver si 256 no es mucho (si)
    struct PlayerBets {
        address playerAddress;
        mapping(uint8 => uint256) numbers;
        mapping(uint8 => uint256) colors; 
        //mapping(uint8 => uint256) evens;
    }


    address private _casinoAddress;
    PlayerBets[] private roulettePlayers;

    constructor (address casinoAddress) {
        _casinoAddress = casinoAddress;
    }

    event RouletteRolled(uint8 number);
    event PlayerAdded(uint8 currentPlayersCount);
    
    function addPlayerToRoulette() public {
        PlayerBets storage player;
        player.playerAddress = msg.sender;
    }



    function execute(uint256 randomNumber) override external {

    }

}
