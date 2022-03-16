import React, { useEffect, useState } from 'react';
import {
  isEmpty,
  message,
  connectWallet,
  getContract,
  tokenToWei,
} from './utils';
import { useSelector, useDispatch } from 'react-redux';
import { setUpUser, setUpWeb3, setUpRigelPool,setUserAddress } from './store/action';
import { tokens, NETWORKS , BACKEND_API } from './constants/index';
import * as ERC20Tokens from './contracts';
import axios from "axios";

function App() {
  const web3 = useSelector((state) => state.web3);
  const rigelpool = useSelector((state) => state.rigelPool);
  const user = useSelector((state) => state.user);
  const [data, setData] = useState({
    token1: '',
    token2: '',
    amount1: '',
    amount2: '',
  });
  const [dataPrices, setPrices] = useState({
    token1Price: 0,
    token2Price: 0,
    share: 0
  });
  const [images, setImages] = useState({ img1: '', img2: '' });


  const dispatch = useDispatch();

  const connectUser = async (e) => {
    e.preventDefault();
    if (isEmpty(web3.instance)) {
      message('error', 'No web3 instance found');
      return;
    }
    try {
      const userData = await connectWallet(web3.instance);
      if (!isEmpty(userData) && userData.length === 2) {
        dispatch(
          setUpUser({
            provider: userData[0],
            address: userData[1],
            status: 'connect',
          })
        );
      }
    } catch (error) {
      message('error', error.message);
    }
  };

  const disconnectUser = async (e) => {
    e.preventDefault();
    if (isEmpty(web3.instance)) {
      message('error', 'Please install metamask');
      return;
    }
    dispatch(setUpUser({ status: 'disconnect' }));
  };

  const tokenSelectHandler = (e) => {
    
    if(e.target.name === 'amount1' && isNaN((e.target.value))){ return}
    if(e.target.name === 'amount2' && isNaN((e.target.value))){ return}
    if(e.target.name === 'token1' && e.target.value === data.token2){ setData({ ...data, token1: '' }); setImages({ ...images, img1: '' }); return}
    if(e.target.name === 'token2' && e.target.value === data.token1){setData({ ...data, token2: '' });setImages({ ...images, img2: '' });return}

    if (e.target.name === 'token1' && !isEmpty(e.target.value)) {
      setImages({ ...images, img1: tokens[e.target.value].logo });
    }

    if (e.target.name === 'token2' && !isEmpty(e.target.value)) {
      setImages({ ...images, img2: tokens[e.target.value].logo });
    }

    if(e.target.name === 'amount1' && !isEmpty(e.target.value) && !isEmpty(dataPrices.token1Price)){
      const _data = data;
      _data.amount2 =Math.round(e.target.value/dataPrices.token1Price)
      setData(_data);
    }

    if(e.target.name === 'amount2' && !isEmpty(e.target.value) && !isEmpty(dataPrices.token2Price)){
      const _data = data;
      _data.amount1 = Math.round(e.target.value/dataPrices.token2Price)
      setData(_data);
    }

    setData({ ...data, [e.target.name]: e.target.value });
  };

  const addLiquidity = async (e) => {
    if (
      isEmpty(data.token1) ||
      isEmpty(data.token2) ||
      isEmpty(data.amount1) ||
      isNaN(data.amount1) ||
      isNaN(data.amount2) ||
      isEmpty(data.amount2)
    ) {
      message('error', 'Please Enter/Select Valid Data');
      return;
    }

    if (data.token1 === data.token2) {
      message('error', 'Please Enter/Select Valid Data');
      return;
    }

    try {
      const chainId = isEmpty(
        tokens[data.token1].address[NETWORKS[NETWORKS['ACTIVE']].chainId]
      )
        ? 5777
        : NETWORKS[NETWORKS['ACTIVE']].chainId;
      const obj = {
        _token1: tokens[data.token1].address[chainId],
        _token2: tokens[data.token2].address[chainId],
        _amount1: data.amount1,
        _amount2: data.amount2,
      };
      const token1Obj = await getContract(
        user.provider,
        ERC20Tokens[data.token1.toUpperCase()]
      );

      const token2Obj = await getContract(
        user.provider,
        ERC20Tokens[data.token2.toUpperCase()]
      );
      let weiAmount1 = tokenToWei(data.amount1, tokens[data.token1].decimals);
      let weiAmount2 = tokenToWei(data.amount2, tokens[data.token2].decimals);
     

      // //check if the user has enough balance for this
      const token1Balance = (
        await token1Obj.balanceOf(user.address)
      ).toString();
      const token2Balance = (
        await token2Obj.balanceOf(user.address)
      ).toString();
    
      if (parseFloat(weiAmount1.toString()) > parseFloat(token1Balance)) {
        throw new Error(
          `You don't have sufficient ${data.token1.toUpperCase()} in your metamask wallet`
        );
      }
      if (parseFloat(weiAmount2.toString()) > parseFloat(token2Balance)) {
        throw new Error(
          `You don't have sufficient ${data.token2.toUpperCase()} in your metamask wallet`
        );
      }
      // //check for allowance
      const allowance1 = (
        await token1Obj.allowance(user.address, rigelpool.instance.address)
      ).toString();
      const allowance2 = (
        await token2Obj.allowance(user.address, rigelpool.instance.address)
      ).toString();
        console.log(weiAmount1,weiAmount2)
      if (allowance1 < weiAmount1) {
        await token1Obj.approve(rigelpool.instance.address, weiAmount1); // approve contract to spend this wei
      }

      if (allowance2 < weiAmount2) {
        await token2Obj.approve(rigelpool.instance.address, weiAmount2); // approve contract to spend this wei
      }

      const transaction = await rigelpool.instance
        .connect(user.provider)
        .addLiquidity(obj, { from: user.address });
       await transaction.wait();
       
    } catch (error) {
      console.log(error)
      message('error', error.message);
    }
  };

  //web3 setup
  useEffect(() => {
    const init = async () => {
      dispatch(setUpWeb3());
    };
    init();
    return () => {};
  }, [dispatch]);

  //rigelpool setup
  useEffect(() => {
    const init = async () => {
      if (isEmpty(web3.loading) && !isEmpty(web3.instance)) {
        dispatch(setUpRigelPool());
      }
    };
    init();
    return () => {};
  }, [dispatch, web3]);

  //user connection
  useEffect(() => {
    const init = async () => {
      if (isEmpty(web3.loading) && !isEmpty(web3.instance)) {
        try {
          if (!isEmpty(localStorage.getItem('user'))) {
            const userData = await connectWallet(web3.instance);
            if (!isEmpty(userData) && userData.length === 2) {
              dispatch(
                setUpUser({
                  provider: userData[0],
                  address: userData[1],
                  status: 'connect',
                })
              );
            }
          }
        } catch (error) {
          message('error', error.message);
        }
      }
    };
    init();
    return () => {};
  }, [dispatch, web3]);

  //pool update
  useEffect(() => {
    const init = async () => {
      if (
        !isEmpty(data.token1) &&
        !isEmpty(data.token2) &&
        !isEmpty(rigelpool.instance)
      ) {
       
         try{
          const network_id = isEmpty(
            tokens[data.token1].address[NETWORKS[NETWORKS["ACTIVE"]].chainId]
          ) ? 5777 :NETWORKS[NETWORKS["ACTIVE"]].chainId;


    

          const token1 =  tokens[data.token1].address[network_id];
          const token2 =  tokens[data.token2].address[network_id];

       
          const pairLiquidity = await rigelpool.instance
            .connect(user.provider)
            .getPairLiquidity(token1, token2, { from: user.address });


          const providerLiquidity = await rigelpool.instance
            .connect(user.provider)
            .getProviderLiquidity(token1, token2, { from: user.address });
    
            const poolReserve1 = pairLiquidity.amount1.toString()
            const poolReserve2 = pairLiquidity.amount2.toString()
            const poolReserve1User = providerLiquidity.amount1.toString()
            const poolReserve2User = providerLiquidity.amount2.toString()
            const kP = poolReserve1* poolReserve2;
            const kpUser = poolReserve1User*poolReserve2User;
            const token1Price = poolReserve2/(isEmpty(parseFloat(poolReserve1)) ? 1 : poolReserve1);
            const token2Price = poolReserve1/(isEmpty(parseFloat(poolReserve2)) ? 1 : poolReserve2);
            const share = (100*kpUser)/(isEmpty(parseFloat(kP)) ? 1 : kP);
            setPrices({
              token1Price: token1Price,
              token2Price: token2Price,
              share:share
            })
         }catch(e){
          console.log(e)
         }
      }
    };
    init();
    return () => {};
  }, [rigelpool, data]);

  useEffect(() => {
    
 
      if ( !isEmpty(rigelpool) && !isEmpty(rigelpool.instance)) {
        try{
          rigelpool.instance.on('LiquidityProvided',async (provider,token1,token2,amount1,amount2,time,event)=>{
            if((provider === user.address) && (amount1 == data.amount1) && (amount2 == data.amount2)){
              message('success','Liquidity Provider Successfully');
              setData({  ...data,  amount1: '',amount2: '',});
              await axios.post(BACKEND_API,{record:{provider,token1,token2,amount1:amount1.toString(),amount2:amount2.toString(),time:time.toString()}});
            }
          })
        }catch(error){
  
        }
      }
    
  },[rigelpool, data , user.address ])


   //event listners
   useEffect(() => {
    //account change handler
    const handleAccountsChanged = async (accounts) => {
      const userData = await connectWallet(web3.instance, alert);
      if (!isEmpty(userData) && userData.length === 2) {
        dispatch(setUserAddress(userData[1]));
      }
    };

    //set event to listen to account change
    if (!isEmpty(web3.instance) && !isEmpty(user.address)) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    //register events to update changes
    return () => {
      if (!isEmpty(web3.instance) && !isEmpty(user.address)) {
        window.ethereum.removeListener(
          'accountsChanged',
          handleAccountsChanged
        );
      }
    };
  }, [user, dispatch, web3]);









  return (
    <div className="wrapper">
      <div className="container">
        <div className="row pt-1">
          <div className="col-6">
            <h1 className="h4">RigelPool</h1>
          </div>
          <div className="col-6 text-right p-2">
            {isEmpty(user.address) ? (
              <button onClick={connectUser} className="btn border text-light">
                Connect Wallet
              </button>
            ) : (
              <button
                onClick={disconnectUser}
                className="btn btn-danger border text-light"
              >
                Disconnect Wallet
              </button>
            )}
            <span className="mt-2 d-block">
              {' '}
              <b>Address</b> : {user.address}
            </span>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row pt-5">
          <div className="box col-12  col-md-5 offset-md-4 col-lg-5 offset-lg-4 p-0 card shadow ">
            <div className="header pt-5 pl-4 pr-4 pb-2 row ">
              <div className="icon col-2 col-md-1 col-lg-1  p-2">
                <i className="fa fa-arrow-left" />
              </div>
              <div className="content col-7 col-md-8 col-lg-8   pl-4">
                <h3>Add Liquidity</h3>
                <span>Add liquidity to receive LP tokens</span>
              </div>
              <div className="icon col-2  col-md-2 col-lg-2  p-2">
                <i className="fa fa-cog" />
              </div>
              <div className="icon col-1  col-md-1 col-lg-1  p-2">
                <i className="fa fa-refresh" />
              </div>
            </div>
            
            <div className="row pl-5 pr-5 pt-4">
              <div className="form-group col-md-12 col-sm-12 ">
                <div className="row">
                  {!isEmpty(images.img1) ? (
                    <div className="img col-2  col-md-2  text-center">
                      <img src={images.img1} alt="" />
                    </div>
                  ) : (
                    ''
                  )}
                  <div className="col-5 col-md-5 selectBox text-center">
                    <select value={data.token1} onChange={tokenSelectHandler} name="token1">
                      <option value="0">Select a currency</option>
                      {Object.keys(tokens).map((data, index) => (
                        <option key={index} value={data}>
                          {tokens[data].symbol}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="input row">
                  <input
                    type="text"
                    placeholder="0.0"
                    className="form-control col-md-12 text-right"
                    onChange={tokenSelectHandler}
                    name="amount1"
                    value={data.amount1}
                  />
                </div>
              </div>
              <div className="form-group col-md-12 text-center  ">
                <i className="fa fa-plus" />
              </div>
              <div className="form-group col-md-12 col-sm-12 ">
                <div className="row">
                  {!isEmpty(images.img2) ? (
                    <div className="img col-2  col-md-2  text-center">
                      <img src={images.img2} alt="" />
                    </div>
                  ) : (
                    ''
                  )}
                  <div className="col-5 col-md-5 selectBox text-center">
                    <select value={data.token2} onChange={tokenSelectHandler} name="token2">
                      <option value="0">Select a currency</option>
                      {Object.keys(tokens).map((data, index) => (
                        <option key={index} value={data}>
                          {tokens[data].symbol}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="input row">
                  <input
                    type="text"
                    placeholder="0.0"
                    className="form-control col-md-12 text-right"
                    onChange={tokenSelectHandler}
                    name="amount2"
                    value={data.amount2}
                  />
                </div>
              </div>
            </div>
            {!isEmpty(dataPrices.token1Price) && !isEmpty(dataPrices.token2Price) && !isEmpty(dataPrices.share) ? (
            <div className="display row pl-4 pr-4 pb-1 pt-1">
            <div className="col-md-12 info pt-3">
              <h4>Prices and pool share</h4>
              <div className="detail row p-3">
                <div className="col-6 col-md-4 text-center">
                  <h4>{dataPrices.token1Price.toFixed(7)}</h4>
                  <p>{data.token1.toUpperCase()} per {data.token2.toUpperCase()}</p>
                </div>
                <div className="col-6 col-md-4 text-center">
                  <h4>{dataPrices.token2Price.toFixed(7)}</h4>
                  <p>{data.token2.toUpperCase()} per {data.token1.toUpperCase()}</p>

                </div>
                <div className="col-6 col-md-4 text-center">
                  <h4>{dataPrices.share.toFixed(2)}%</h4>
                  <p>Share of Pool</p>
                </div>
              </div>
            </div>
          </div>
            ) : '' }

            <div className="col-md-12 p-3">
              {isEmpty(user.address) ? (
                <button onClick={connectUser} className="btn  d-block mainBtn">
                  Connect Wallet
                </button>
              ) : (
                <button
                  onClick={addLiquidity}
                  disabled={
                    isEmpty(data.token1) ||
                    isEmpty(data.token2) ||
                    isEmpty(data.amount1) ||
                    isEmpty(data.amount2)
                      ? 'disabled'
                      : ''
                  }
                  className="btn  d-block mainBtn"
                >
                  Enter an amount
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
