const TodoList = artifacts.require("TodoList");

module.exports = function (deployer) {
  deployer.deploy(TodoList);
};

// Run `truffle migrate` to deploy the contract.