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
export const INITIALIZE_USER_ADDRESS  = "INITIALIZE_USER_ADDRESS";



export const BACKEND_API = "http://localhost:5000/record-liquidity";

export const NETWORKS = {
    ACTIVE: "BINANCE_TEST_NET",
    GANACHE : {
       chainId : 1337,
       chainIdHex : "0x539",
       rpc : "http://127.0.0.1:9545/",
       network_name : "ganache",
       network_symbol : "ETH",
       decimal : 18,
       explorer : '',
       native_currency_name : 'Ethereum'
   },
   BINANCE_TEST_NET : {
    chainId : 97,
    chainIdHex : "0x61",
    rpc : "https://data-seed-prebsc-1-s1.binance.org:8545/",
    network_name : "Binance Smart Chain - Testnet",
    network_symbol : "BNB",
    decimal : 8,
    explorer : 'https://testnet.bscscan.com',
    native_currency_name : 'BNB'
},
};




export const tokens = {
    busd: {
      symbol: 'BUSD',
      address: {
        5777: '0x3543f6eECeCC449354b8bD0a8d8e43E10d9c434C',
        97: '0xad9b4e6cAa4216447F1f3D958aA7CBCB9CEFeab2',
      },
      logo: "https://seeklogo.com/images/B/binance-coin-bnb-logo-CD94CC6D31-seeklogo.com.png",
      decimals: 18,
    },
    bet: {
      symbol: 'BET',
      address: {
        5777: '0xf527b413028167f8f6Cdc12b817f315915B8a458',
        97: '0x970772e6B65eae6D452A6Cc5384d3f381F313B7c',
      },
      decimals: 18,
      logo : "https://cdn.dribbble.com/users/4189349/screenshots/11209589/screen_shot_2020-04-29_at_9.36.23_am.png"
    },
    rep: {
        symbol: 'REP',
        address: {
          5777: '0x0a57585722F07D7514F684b70635F90C38A3F9CB',
          97: '0xef1A8c6df339f1BDa07038590B210C9b42C9C372',
        },
        decimals: 8,
        logo : "https://s2.coinmarketcap.com/static/img/coins/200x200/1104.png"
      },
      zrx: {
        symbol: 'ZRX',
        address: {
          5777: '0xf25B0826702c7d416e323B8f97b93328F67F8d1f',
          97: '0x0a9999aaF5AA5626F26184d09ba4a4C13409A2eD',
        },
        decimals: 18,
        logo : "https://s2.coinmarketcap.com/static/img/coins/200x200/1896.png"
      },

  }