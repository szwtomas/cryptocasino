pragma solidity ^0.8.0;

interface RandomnessOracleInterface {

  event GetRandomNumber(address callerAddress, uint id);
  event SetRandomNumber(uint256 randomNumber, address callerAddress);

  function getRandomNumber() external returns (uint256);

  function setRandomNumber(uint256 _randomNumber, address _callerAddress,   uint256 _id) external;
}
