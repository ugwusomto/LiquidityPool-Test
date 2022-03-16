const RigelPool = artifacts.require('RigelPool.sol');
const Busd = artifacts.require('mocks/Busd.sol');
const Bet = artifacts.require('mocks/Bet.sol');
const Rep = artifacts.require('mocks/Rep.sol');
const Zrx = artifacts.require('mocks/Zrx.sol');
const { ethers } = require('ethers');

module.exports = async (deployer, network, accounts) => {
  if (network === 'development') {
    let rigelpool,
    busd,
    bet,
    rep,
    zrx;
    let owner = accounts[0];
    let person1 = accounts[1];
    let person2 = accounts[2];


    await Promise.all([
      deployer.deploy(Busd),
      deployer.deploy(Bet),
      deployer.deploy(Rep),
      deployer.deploy(Zrx),
    ]);

     [busd,bet,rep,zrx] = await Promise.all([
        Busd.deployed(),
        Bet.deployed(),
        Rep.deployed(),
        Zrx.deployed(),
    ]);


    await  deployer.deploy(RigelPool,busd.address,bet.address,rep.address,zrx.address);
    rigelpool = RigelPool.deployed();
    busdAmount = ethers.utils.parseUnits(
      '10000',
      (await busd.decimals()).toString()
    );

    betAmount = ethers.utils.parseUnits(
        '10000',
        (await bet.decimals()).toString()
      );
    
      repAmount = ethers.utils.parseUnits(
        '10000',
        (await rep.decimals()).toString()
      );
      zrxAmount = ethers.utils.parseUnits(
        '10000',
        (await zrx.decimals()).toString()
      );

    await Promise.all([
      busd.faucet(person1, busdAmount),
      bet.faucet(person1, betAmount),
      rep.faucet(person1, repAmount),
      zrx.faucet(person1, zrxAmount),
      busd.faucet(person2, busdAmount),
      bet.faucet(person2, betAmount),
      rep.faucet(person2, repAmount),
      zrx.faucet(person2, zrxAmount),
    ]);

   
  }else if(network === "binanceTestnet"){
    let rigelpool,
    busd,
    bet,
    rep,
    zrx;
    let owner = accounts[0];



    await Promise.all([
      deployer.deploy(Busd),
      deployer.deploy(Bet),
      deployer.deploy(Rep),
      deployer.deploy(Zrx),
    ]);

     [busd,bet,rep,zrx] = await Promise.all([
        Busd.deployed(),
        Bet.deployed(),
        Rep.deployed(),
        Zrx.deployed(),
    ]);


    await  deployer.deploy(RigelPool,busd.address,bet.address,rep.address,zrx.address);
    rigelpool = RigelPool.deployed();
    busdAmount = ethers.utils.parseUnits(
      '10000',
      (await busd.decimals()).toString()
    );

    betAmount = ethers.utils.parseUnits(
        '10000',
        (await bet.decimals()).toString()
      );
    
      repAmount = ethers.utils.parseUnits(
        '10000',
        (await rep.decimals()).toString()
      );
      zrxAmount = ethers.utils.parseUnits(
        '10000',
        (await zrx.decimals()).toString()
      );

    await Promise.all([
      busd.faucet(owner, busdAmount),
      bet.faucet(owner, betAmount),
      rep.faucet(owner, repAmount),
      zrx.faucet(owner, zrxAmount),
    ]);

  }
};
