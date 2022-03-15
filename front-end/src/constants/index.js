export const WEB3_REQUEST  = "WEB3_REQUEST";
export const WEB3_SUCCESS  = "WEB3_SUCCESS";
export const WEB3_FAIL  = "WEB3_FAIL";

export const RIGELPOOL_REQUEST  = "RIGELPOOL_REQUEST";
export const RIGELPOOL_SUCCESS  = "RIGELPOOL_SUCCESS";
export const RIGELPOOL_FAIL  = "RIGELPOOL_FAIL";

export const WALLET_CONNECT_REQUEST  = "WALLET_CONNECT_REQUEST";
export const WALLET_CONNECT_SUCCESS  = "WALLET_CONNECT_SUCCESS";
export const WALLET_CONNECT_FAIL  = "WALLET_CONNECT_FAIL";
export const WALLET_DISCONNECT_SUCCESS  = "WALLET_DISCONNECT_SUCCESS";


export const NETWORKS = {
    ACTIVE: "GANACHE",
    GANACHE : {
       chainId : 1337,
       chainIdHex : "0x539",
       rpc : "http://127.0.0.1:9545/",
       network_name : "ganache",
       network_symbol : "ETH",
       decimal : 18,
       explorer : '',
       native_currency_name : 'Ethereum'
   }
};




export const tokens = {
    busd: {
      symbol: 'BUSD',
      address: {
        5777: '0xe33FD95701128F526aCCF0aF00356db04fa05c20',
      },
      logo: "https://seeklogo.com/images/B/binance-coin-bnb-logo-CD94CC6D31-seeklogo.com.png",
      decimals: 18,
    },
    bet: {
      symbol: 'BET',
      address: {
        5777: '0x5Fb013Ef5E97B4a7Cd2Bf8543f897301945e5B17',
      },
      decimals: 18,
      logo : "https://cdn.dribbble.com/users/4189349/screenshots/11209589/screen_shot_2020-04-29_at_9.36.23_am.png"
    },
    rep: {
        symbol: 'REP',
        address: {
          5777: '0xfAD8442C89b7915b96c639EB3BD93F2F5C6519C9',
        },
        decimals: 8,
        logo : "https://s2.coinmarketcap.com/static/img/coins/200x200/1104.png"
      },
      zrx: {
        symbol: 'ZRX',
        address: {
          5777: '0x59dcF961AE9bF16faf12E9314BD6264906094C01',
        },
        decimals: 18,
        logo : "https://s2.coinmarketcap.com/static/img/coins/200x200/1896.png"
      },

  }