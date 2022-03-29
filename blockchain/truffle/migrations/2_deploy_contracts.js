var StakeAllContract = artifacts.require("./StakeAllContract.sol");
var BatchedPermissionContract = artifacts.require("./BatchedPermissionContract.sol");
var SingleLevelAuth = artifacts.require("./SingleLevelAuthContract.sol");
var MultiLevelAuth = artifacts.require("./MultiLevelAuthContract.sol");

module.exports = function(deployer) {
  deployer.deploy(StakeAllContract);
  deployer.deploy(BatchedPermissionContract);
  deployer.deploy(SingleLevelAuth);
  deployer.deploy(MultiLevelAuth);
};
