// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ZRX is ERC20 {
    address admin;

    constructor() public ERC20("ZRX Token", "ZRX") {
        admin = msg.sender;
        _setupDecimals(18);
    }

    function mint(uint256 amount, address reciepient) external {
        require(msg.sender == admin, "Only Admin");
        _mint(reciepient, amount);
    }

    function faucet(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
