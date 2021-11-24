pragma solidity ^0.8.0;

interface CryptoCasinoInterface {

  function transfer(address recipient, uint256 amount) external returns (bool);
  function transferFrom(
          address sender,
          uint256 amount
      ) external returns (bool);

  function updateRandomNumber() external;

}
