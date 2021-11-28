// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "./CryptoCasinoInterface.sol";
import "./CryptoGame.sol";

contract CryptoRoulette is CryptoGame {
    
    struct NumberBet {
      uint8 number;
      uint256 bet;
    }

    enum BetColor {Red, Blue}

    struct ColorBet {
      BetColor color;
      uint256 bet;
    }

    struct PlayerBet {
        address playerAddress;
        NumberBet[37] numberBets;
        ColorBet[2] colorBets;
        uint256 chipsWon;
    }

    struct Child {
        uint ed;
    } 

    struct Parent { 
        mapping(uint => Child) children;
        uint childrenSize;
    }

    CryptoCasinoInterface casino;
    PlayerBet[2] public roulettePlayers;

    uint numPlayers;

    constructor (address casinoAddress) {
        casino = CryptoCasinoInterface(casinoAddress);
        numPlayers = 0;
    }

    event RouletteRolled(address winner, uint8 number);
    event PlayerAdded(uint8 currentPlayersCount);
    
   

    function addPlayerToRoulette(NumberBet[2] memory numbBets, uint8 numbBetsSize, ColorBet[1] memory colBets, uint8 colBetsSize) public {
        require(numPlayers <= 2, "Table is full, come back later.");
        uint256 quantity = 0;
        for(uint8 j = 0; j < numbBetsSize; j++){
            quantity += numbBets[j].bet;
        }

        for(uint8 j = 0; j < colBetsSize; j++){
            quantity += colBets[j].bet;
        }
        casino.transferFrom(msg.sender, quantity);
        PlayerBet storage currentPlayer = roulettePlayers[numPlayers++];
        currentPlayer.playerAddress = msg.sender;
        currentPlayer.chipsWon = 0;

        for(uint8 j = 0; j < numbBetsSize; j++){
            currentPlayer.numberBets[j] = NumberBet(numbBets[j].number, numbBets[j].bet);
        }

        for(uint8 j = 0; j < colBetsSize; j++){
            currentPlayer.colorBets[j] = ColorBet(colBets[j].color, colBets[j].bet);
        }

        if (numPlayers == 2){
            casino.updateRandomNumber();
        }
    }

    function execute(uint256 randomNumber) override external {
      uint8 rouletteNumber = uint8(randomNumber % 37 + 1);
      address winner = address(0);
      for(uint8 i = 0; i < 1; i++){
        PlayerBet storage playerBet = roulettePlayers[i];
        NumberBet[37] storage numbBets = playerBet.numberBets;
        for(uint8 j = 0; j < numbBets.length; j++){
          if(numbBets[j].number == rouletteNumber) {
            playerBet.chipsWon = playerBet.chipsWon + numbBets[j].bet * 2;
          }
        }

        ColorBet[2] storage colBets = playerBet.colorBets;
        for(uint8 j = 0; j < colBets.length; j++){
          BetColor rouletteColor = BetColor(rouletteNumber%1);
          if(colBets[j].color == rouletteColor) {
            playerBet.chipsWon = playerBet.chipsWon + colBets[j].bet * 2;
          }
        }
        casino.transfer(playerBet.playerAddress, playerBet.chipsWon);
      }

      numPlayers = 0;

      emit RouletteRolled(winner, rouletteNumber);
    }
}
