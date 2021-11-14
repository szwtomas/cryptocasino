pragma solidity ^0.8.0;

import "./Randomizable.sol";
import "./Ownable.sol";
import "./CryptoChip.sol";
import "./IERC20.sol";

contract CryptoCasino is Ownable, Randomizable {

    IERC20 chipContract;
    

    event Bought(uint256 amount);
    event Sold(uint256 amount);

    constructor (address _oracleAddress) Randomizable(_oracleAddress){
    }

    function buy() payable public {
        uint256 amountToBuy = msg.value;
        //uint256 resto = amountToBuy % 10000000000000000;
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
        payable(msg.sender).transfer(amount);
        emit Sold(amount);
    }

    function balance() public view returns (uint256) {
        return chipContract.balanceOf(msg.sender);
    }

    function setChipContractAddress(address _address) external onlyOwner {
        chipContract = IERC20(_address);
    }

    

}