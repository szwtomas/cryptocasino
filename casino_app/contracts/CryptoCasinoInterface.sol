// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface CryptoCasinoInterface {

  function transfer(address recipient, uint256 amount) external returns (bool);
  function transferFrom(
          address sender,
          uint256 amount
      ) external returns (bool);

  function balanceOf(address addr) external view returns(uint256);

  function updateRandomNumber() external;

}
