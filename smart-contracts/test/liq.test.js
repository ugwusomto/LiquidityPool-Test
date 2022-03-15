const RigelPool = artifacts.require('RigelPool.sol');
const Busd = artifacts.require('mocks/Busd.sol');
const Bet = artifacts.require('mocks/Bet.sol');
const Rep = artifacts.require('mocks/Rep.sol');
const Zrx = artifacts.require('mocks/Zrx.sol');
const { expectRevert , expectEvent } = require('@openzeppelin/test-helpers');
const { ethers } = require('ethers');
const {solidityPack , solidityKeccak256} = ethers.utils;

contract('RigelPool', (accounts) => {


  let rigelpool,
  busd,
  bet,
  rep,
  zrx;
  let owner = accounts[0];
  let person1 = accounts[1];

  beforeEach(async () => {
        //deploy the contract
        
        busd = await Busd.new();
        bet = await Bet.new();
        rep = await Rep.new();
        zrx = await Zrx.new();
        rigelpool = await RigelPool.new(busd.address,bet.address,rep.address,zrx.address);


        const amount_busd  = ethers.utils.parseUnits('10000',(await busd.decimals()).toString());
        const amount_bet  = ethers.utils.parseUnits('10000',(await bet.decimals()).toString());
        const amount_rep  = ethers.utils.parseUnits('10000',(await rep.decimals()).toString());
        const amount_zrx  = ethers.utils.parseUnits('10000',(await zrx.decimals()).toString());

        //mint token to addresses
        await busd.faucet(person1, amount_busd);
        await bet.faucet(person1, amount_bet);
        await rep.faucet(person1, amount_rep);
        await zrx.faucet(person1, amount_zrx);

        //set allowance 
        await busd.approve(rigelpool.address, amount_busd, { from: person1 });
        await bet.approve(rigelpool.address, amount_busd, { from: person1 });
        await rep.approve(rigelpool.address, amount_rep, { from: person1 });
        await zrx.approve(rigelpool.address, amount_zrx, { from: person1 });
  });

  it('should deploy contract successfully and set pair', async () => {
     const pair1 = await rigelpool.allPair(solidityKeccak256(["bytes"],[solidityPack(["address","address"],[busd.address,bet.address])]));
     const pair2 = await rigelpool.allPair(solidityKeccak256(["bytes"],[solidityPack(["address","address"],[rep.address,zrx.address])]));
     expect(pair1.token1).to.equal(busd.address);
     expect(pair1.token2).to.equal(bet.address);
     expect(pair2.token1).to.equal(rep.address);
     expect(pair2.token2).to.equal(zrx.address);
  });

  it.only("should provide liquidity", async () => {
    const liquidityData = {_token1 : busd.address,  _token2 :  bet.address , _amount1 : ethers.utils.parseUnits('1000',(await busd.decimals()).toString()), _amount2 : ethers.utils.parseUnits('1000',(await bet.decimals()).toString()) }
    const tx =  await rigelpool.addLiquidity(liquidityData,{from : person1});
    expect((await busd.balanceOf(rigelpool.address)).toString()).to.equal("1000000000000000000000");
    expect((await bet.balanceOf(rigelpool.address)).toString()).to.equal("1000000000000000000000");
    expect((await busd.balanceOf(person1)).toString()).to.equal("9000000000000000000000");
    expect((await bet.balanceOf(person1)).toString()).to.equal("9000000000000000000000");
    const contractLiquidity = await rigelpool.getPairLiquidity(busd.address,bet.address);
    const providerLiquidity = await rigelpool.getProviderLiquidity(busd.address,bet.address, {from : person1});
    expect(contractLiquidity.amount1.toString()).to.equal("1000000000000000000000");
    expect(contractLiquidity.amount2.toString()).to.equal("1000000000000000000000");
    expect(providerLiquidity.amount1.toString()).to.equal("1000000000000000000000");
    expect(providerLiquidity.amount2.toString()).to.equal("1000000000000000000000");
    expectEvent(tx,"LiquidityProvided",{
      provider: person1,
      token1 : busd.address,
      token2 : bet.address,
      amount1 : "1000000000000000000000",
      amount2 :  "1000000000000000000000"
    })
  }) 


})

