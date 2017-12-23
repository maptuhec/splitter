var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "raw pig curious lock girl knife tumble lawn repair insane question scale reason shuffle firm";
module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/K457ZOO9HrK05gy4Yd9B ")
      },
      network_id: 3,
      host: "localhost",
      port: 8545,
      gas: 2900000
    }
  }
};