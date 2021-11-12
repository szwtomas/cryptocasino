pragma solidity ^0.8.0;

import "./RandomnessOracleInterface.sol";
import "./Ownable.sol";

interface RandomizableInterface {
    
    event newOracleAddressEvent(address oracleAddress);
    event ReceivedNewRequestIdEvent(uint256 id);
    function setOracleInstanceAddress (address _oracleInstanceAddress) external;
    
    function callback(uint256 _randomNumber, uint256 _id) external;
}




contract Randomizable is Ownable {
    
    RandomnessOracleInterface private oracleInstance;
    address private oracleAddress;
    uint256 private randomNumber;
    mapping(uint256=>bool) myRequests;
    event newOracleAddressEvent(address oracleAddress);
    event ReceivedNewRequestIdEvent(uint256 id);
    event RandomNumberUpdatedEvent(uint256 randomNumber, uint256 id);
    
    function setOracleInstanceAddress (address _oracleInstanceAddress) public onlyOwner {
      oracleAddress = _oracleInstanceAddress;
      oracleInstance = RandomnessOracleInterface(oracleAddress);
      emit newOracleAddressEvent(oracleAddress);
    }


    function updateRandonNumber() public {
        uint256 id = oracleInstance.getRandomNumber();
        myRequests[id] = true;
        emit ReceivedNewRequestIdEvent(id);
    }
    function callback(uint256 _randomNumber, uint256 _id) public onlyOracle {
        require(myRequests[_id], "This request is not in my pending list.");
        randomNumber = _randomNumber;
        delete myRequests[_id];
        emit RandomNumberUpdatedEvent(_randomNumber, _id);
    }
    modifier onlyOracle() {
        require(msg.sender == oracleAddress, "You are not authorized to call this function.");
        _;
    }




}


