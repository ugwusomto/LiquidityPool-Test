import {WEB3_REQUEST,WEB3_SUCCESS ,WEB3_FAIL  , RIGELPOOL_REQUEST,RIGELPOOL_SUCCESS ,RIGELPOOL_FAIL,
    WALLET_CONNECT_REQUEST, WALLET_CONNECT_SUCCESS  , WALLET_DISCONNECT_SUCCESS, INITIALIZE_USER_ADDRESS
} from "../constants";
import {getReadOnlyProvider, isEmpty , getRigelPoolContract , message} from "../utils"

import RigelPoolObject from "../contracts/RigelPool.json";




//set up web3
export const setUpWeb3 = (obj = {}) => {
    return async (dispatch) => {
      try{
        dispatch({ type: WEB3_REQUEST });
        const web3 = await getReadOnlyProvider();
        if(isEmpty(web3)){ throw new Error("Please install metamask"); }
        dispatch({ type: WEB3_SUCCESS , payload : web3});
      }catch(error){
        message('error',error.message);
        dispatch({ type: WEB3_FAIL });
      }
    };
  };


//set up rigelPool instance
export const setUpRigelPool = (obj = {}) => {
    return async (dispatch , getState) => {
      try{
        dispatch({ type: RIGELPOOL_REQUEST});
        const exchange = await getRigelPoolContract(getState().web3.instance,RigelPoolObject);
        dispatch({ type: RIGELPOOL_SUCCESS, payload: exchange });
      }catch(error){
        message('error',error.message);
        dispatch({ type: RIGELPOOL_FAIL });
      }
    };
  };


  //User Actions
export const setUpUser = ({ provider, address, status }) => {
    return async (dispatch) => {

      try{
        dispatch({ type: WALLET_CONNECT_REQUEST });
        if (status === 'connect') {
          localStorage.setItem('user', JSON.stringify({ address }));
          dispatch({
            type: WALLET_CONNECT_SUCCESS,
            payload: { address, provider },
          });
        } else if (status === 'disconnect') {
          dispatch({
            type: WALLET_DISCONNECT_SUCCESS,
          });
          localStorage.removeItem('user');
        }
      }catch(error){

      }

    };
  };


  export const  setUserAddress =  (address) => {
    return async (dispatch) => {
        dispatch({type: INITIALIZE_USER_ADDRESS,payload : address });
      }
  }