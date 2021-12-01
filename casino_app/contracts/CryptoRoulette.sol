// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "./CryptoCasinoInterface.sol";
import "./CryptoGame.sol";

contract CryptoRoulette is CryptoGame {
    struct NumberBet {
        uint8 number;
        uint256 bet;
    }

    enum BetColor {
        Red,
        Black
    }

    struct ColorBet {
        BetColor color;
        uint256 bet;
    }

    struct RoulettePlayer {
        address playerAddress;
        uint256 chipsWon;
        uint256 numberBetsCount;
        uint256 colorBetsCount;
        mapping(uint256 => NumberBet) numberBets;
        mapping(uint256 => ColorBet) colorBets;
    }

    CryptoCasinoInterface casino;

    uint256 public playersCount;
    mapping(uint256 => RoulettePlayer) public players;

    event RouletteRolled(uint8 number, address playerAddress, uint256 chipsWon);
    event PlayerAdded(uint256 playersCount);

    constructor(address casinoAddress) {
        casino = CryptoCasinoInterface(casinoAddress);
        playersCount = 0;
    }

    function playerIsPlaying() public view returns (bool) {
        for (uint8 i = 0; i < playersCount; i++) {
            if (players[i].playerAddress == msg.sender) {
                return true;
            }
        }
        return false;
    }

    function getPlayerData() external view returns (NumberBet[] memory numbBet, ColorBet[] memory colBet) {
      RoulettePlayer storage player = players[0];
      
       for (uint8 i = 0; i < playersCount; i++) {
            if (players[i].playerAddress == msg.sender) {
                player = players[i];
            }
        }
      require(player.playerAddress == msg.sender, "player is not playing");

      NumberBet[] memory numberBets = new NumberBet[](player.numberBetsCount);
      ColorBet[] memory colorBets = new ColorBet[](player.colorBetsCount);

      for (uint8 i = 0; i < player.numberBetsCount; i++) {
                numberBets[i] = player.numberBets[i];
        }

      for (uint8 i = 0; i < player.colorBetsCount; i++) {
              colorBets[i] = player.colorBets[i];
      }

      return (numberBets, colorBets);
    }

    function addPlayerToRoulette(
        NumberBet[] memory numbBets,
        ColorBet[] memory colBets
    ) public {
        require(playersCount <= 2, "Table is full, come back later.");
        uint256 quantity = 0;

        for (uint i = 0; i < numbBets.length; i++) {
             quantity += numbBets[i].bet;
        }

        for (uint i = 0; i < colBets.length; i++) {
            quantity += colBets[i].bet;
        }

        casino.transferFrom(msg.sender, quantity);


        RoulettePlayer storage player = players[playersCount++];
        player.playerAddress = msg.sender;
        player.chipsWon = 0;

         for (uint i = 0; i < numbBets.length; i++) {
            NumberBet memory numberBet = numbBets[i];
            player.numberBets[player.numberBetsCount++] = numberBet;
        }

        for (uint i = 0; i < colBets.length; i++) {
            ColorBet memory colorBets = colBets[i];
            player.colorBets[player.colorBetsCount++] = colorBets;
        }

        emit PlayerAdded(playersCount);
        if (playersCount == 2) {
            casino.updateRandomNumber();
        }
    }

    function execute(uint256 randomNumber) external override {
        
        uint8 rouletteNumber = uint8((randomNumber % 2));
        for (uint8 i = 0; i < playersCount; i++) {
            RoulettePlayer storage player = players[i];
            for (uint8 j = 0; j < player.numberBetsCount; j++) {
                if (player.numberBets[j].number == rouletteNumber) {
                    player.chipsWon =
                        player.chipsWon +
                        player.numberBets[j].bet *
                        2;
                }
                delete player.numberBets[j];
            }

            for (uint8 j = 0; j < player.colorBetsCount; j++) {
                BetColor rouletteColor = BetColor(rouletteNumber % 1);
                if (player.colorBets[j].color == rouletteColor) {
                    player.chipsWon =
                        player.chipsWon +
                        player.colorBets[j].bet *
                        2;
                }
                delete player.colorBets[j];
            }

            casino.transfer(
                player.playerAddress,
                player.chipsWon
            );
            emit RouletteRolled(rouletteNumber, player.playerAddress, player.chipsWon);
            //delete players[i];
        }

        playersCount = 0;
    }
}
