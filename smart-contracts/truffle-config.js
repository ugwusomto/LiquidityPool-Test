module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 9545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
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
