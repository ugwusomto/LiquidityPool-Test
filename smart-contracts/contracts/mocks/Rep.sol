// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract REP is ERC20 {
    address admin;

    constructor() public ERC20("REP Token", "REP") {
        admin = msg.sender;
        _setupDecimals(8);
    }

    function faucet(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
