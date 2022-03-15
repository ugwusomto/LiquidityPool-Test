import { createStore ,compose, combineReducers ,applyMiddleware} from "redux";
import { userAccountReducer ,  web3Reducer , rigelPoolReducer}  from "./reducer";
import thunk from "redux-thunk";
import { isEmpty } from "../utils";

const initialState  = {
    web3:{loading:false},
    rigelPool : {loading:false},
    user : !isEmpty(localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")) : {loading:false},
};

const reducers = combineReducers({
    web3 : web3Reducer,
    rigelPool : rigelPoolReducer ,
    user:userAccountReducer
});

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers,initialState,storeEnhancers(applyMiddleware(thunk)));
export default store;