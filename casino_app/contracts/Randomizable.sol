// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./RandomnessOracleInterface.sol";
import "./Ownable.sol";

interface RandomizableInterface {
    
    event newOracleAddressEvent(address oracleAddress);
    event ReceivedNewRequestIdEvent(uint256 id);
    function setOracleInstanceAddress (address _oracleInstanceAddress) external;
    function updateRandomNumber(address caller) external;
    function callback(uint256 _randomNumber, uint256 _id) external;
}

interface CallerContract {
    function execute(uint256 _randomNumber) external;
}

contract Randomizable is Ownable {
    
    RandomnessOracleInterface private oracleInstance;
    address private oracleAddress;
    uint256 internal randomNumber;
    mapping(uint256=>bool) myRequests;
    mapping(uint256=>address) requestIdToAddress;
    event newOracleAddressEvent(address oracleAddress);
    event ReceivedNewRequestIdEvent(uint256 id);
    event RandomNumberUpdatedEvent(uint256 randomNumber, uint256 id);
    CallerContract callerContract;
    
    
    constructor(address _oracleAddress){
        oracleAddress = _oracleAddress;
        oracleInstance = RandomnessOracleInterface(oracleAddress);
        emit newOracleAddressEvent(oracleAddress);
    }

    function updateRandomNumber(address caller) public {
        uint _requestId = uint(keccak256(abi.encodePacked(block.timestamp, caller))) % 1000;
        myRequests[_requestId] = true;

        requestIdToAddress[_requestId] = caller;
        
        uint256 id = oracleInstance.getRandomNumber(_requestId);
        emit ReceivedNewRequestIdEvent(id);
    }

    function callback(uint256 _randomNumber, uint256 _id) public onlyOracle {
        require(myRequests[_id], "This request is not in my pending list.");
        callerContract = CallerContract(requestIdToAddress[_id]);
        callerContract.execute(_randomNumber);
        myRequests[_id] = false;
        emit RandomNumberUpdatedEvent(_randomNumber, _id);
    }

    modifier onlyOracle() {
        require(msg.sender == oracleAddress, "You are not authorized to call this function.");
        _;
    }

}


