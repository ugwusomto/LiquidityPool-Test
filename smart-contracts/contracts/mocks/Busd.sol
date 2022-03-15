// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BUSD is ERC20 {
    address admin;

    constructor() public ERC20("BUSD Token", "BUSD") {
        admin = msg.sender;
        _setupDecimals(18);
    }

    function faucet(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
