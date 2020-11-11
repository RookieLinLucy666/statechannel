const stateChannel = artifacts.require("./contracts/stateChannel.sol");

module.exports = function(deployer) {
  deployer.deploy(stateChannel);
};
