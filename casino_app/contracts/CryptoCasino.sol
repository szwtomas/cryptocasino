// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Randomizable.sol";
import "./Ownable.sol";
import "./CryptoChip.sol";
import "./IERC20.sol";
import "./CryptoCasinoInterface.sol";
import "./CryptoGame.sol";

//CryptoCasinoGame tal vez es un mejor nombre
contract CryptoCasino is CryptoCasinoInterface, Ownable {

    IERC20 internal chipContract;
    RandomizableInterface internal randomProviderContract; 
    CryptoGame[] internal _games;

    event Bought(uint256 amount);
    event Sold(uint256 amount);

    constructor  (address _randomizableContract) {
        chipContract = new CryptoChip("Crypto Chip", "CHIP", 1000, address(this));
        randomProviderContract = RandomizableInterface(_randomizableContract);
    }

    function addGame(address _gameAddress) public onlyOwner{
        CryptoGame newGame = CryptoGame(_gameAddress);
        _games.push(newGame);
    }

    function removeGame(uint8 gameNumber) public onlyOwner{
        _games[gameNumber] = _games[_games.length-1];
        delete _games[_games.length-1];
    }

    function buy() public payable {
        uint256 amountToBuy = msg.value;
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

    modifier OnlyValidGames(){
        bool isValidGame = false;
        for (uint8 i = 0; i < _games.length; i++){
            if (address(_games[i]) == msg.sender) {
                isValidGame = true;
            }
        }
        require(isValidGame, "Action denied");
        _;
    }

    function transfer(address recipient, uint amount) external  OnlyValidGames returns (bool) {
        return chipContract.transfer(recipient, amount);
    }

    function transferFrom(address sender, uint amount) external OnlyValidGames returns(bool) {
        return chipContract.transferFrom(sender, address(this), amount);
    }

    function updateRandomNumber() external {
        randomProviderContract.updateRandomNumber(msg.sender);
    }

}
