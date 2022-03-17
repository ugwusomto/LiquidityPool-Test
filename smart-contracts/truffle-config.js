const path = require("path");
const HDWalletProvider = require('@truffle/hdwallet-provider');
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 9545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
     },
     binanceTestnet: {
      provider: () => new HDWalletProvider("", `https://data-seed-prebsc-1-s1.binance.org:8545`),
      network_id: 97,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  mocha: {
    // timeout: 100000
  },
  compilers: {
    solc: {
       version: ">=0.6.0 <0.8.0", 
    }
  },
};
