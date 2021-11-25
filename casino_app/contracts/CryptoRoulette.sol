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
    
    function execute(uint256 randomNumber) override external {

    }

}
