pragma solidity ^0.8.0;

import "./Randomizable.sol";
import "./Ownable.sol";



contract RandomnessOracle is Ownable {
  uint private randNonce = 0;
  uint private modulus = 1000;
  mapping(uint256=>bool) pendingRequests;
  event GetRandomNumber(address callerAddress, uint id);
  event SetRandomNumber(uint256 randomNumber, address callerAddress);

  //TODO: resolver onlyowner sin que explote (conseguir address del casino) 
  function setRandomNumber(uint256 _randomNumber, address _callerAddress,   uint256 _id) public {
    
    //require(pendingRequests[_id], "This request is not in my pending list.");
    //delete pendingRequests[_id];
    RandomizableInterface callerContractInstance;
    callerContractInstance = RandomizableInterface(_callerAddress);
    callerContractInstance.callback(_randomNumber, _id);
    emit SetRandomNumber(_randomNumber, _callerAddress);
  }

  function getRandomNumber() public returns (uint256) {
    randNonce++;
    uint id = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % modulus;
    pendingRequests[id] = true;
    emit GetRandomNumber(msg.sender, id);
    uint randomnum = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % 6 + 1;
    setRandomNumber(randomnum, msg.sender, id);
    return id;
  }


}
