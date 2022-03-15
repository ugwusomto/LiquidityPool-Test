import {WEB3_REQUEST,WEB3_SUCCESS ,WEB3_FAIL  , RIGELPOOL_REQUEST,RIGELPOOL_SUCCESS ,RIGELPOOL_FAIL ,
    WALLET_CONNECT_REQUEST, WALLET_CONNECT_SUCCESS , WALLET_CONNECT_FAIL , WALLET_DISCONNECT_SUCCESS,
} from "../constants";

export const web3Reducer = (state = {loading:false} , action) => {
    switch(action.type){
        case WEB3_REQUEST:
            return {loading : true}
        case WEB3_SUCCESS:
            return {loading : false , instance : action.payload};
        case WEB3_FAIL:
            return {loading : false};
        default:
            return state;
    }
}

export const rigelPoolReducer = (state = {loading:false} , action) => {
    switch(action.type){
        case RIGELPOOL_REQUEST:
            return {loading : true }
        case RIGELPOOL_SUCCESS:
            return {loading : false , instance : action.payload};
        case RIGELPOOL_FAIL:
            return {loading : false};
        default:
            return state;
    }
}

//User reducer
export const userAccountReducer = (state = {loading:false} , action) => {
    switch(action.type){
        case WALLET_CONNECT_REQUEST:
            return {loading:true};
        case WALLET_CONNECT_SUCCESS:
            return {loading:false,...action.payload};
        case WALLET_CONNECT_FAIL:
            return {loading:false,...action.payload}
        case WALLET_DISCONNECT_SUCCESS:
            return {loading: false}
        default:
            return state;
    }
}