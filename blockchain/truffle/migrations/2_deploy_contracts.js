var StakeAllContract = artifacts.require("./StakeAllContract.sol");
var BatchedPermission = artifacts.require("./BatchedPermissionContract.sol");
var SimpleAuth = artifacts.require("./SimpleAuthContract.sol");

module.exports = function(deployer) {
  deployer.deploy(StakeAllContract);
  deployer.deploy(BatchedPermission);
  deployer.deploy(SimpleAuth);
};
