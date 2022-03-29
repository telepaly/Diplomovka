// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0;

interface IAuthContract {
    function getNodeAuthStatus(address _owner) external view returns (bool authentificated);
}

contract StakeAllContract {
    /*Struct Stake defines data type of storing stake amount and node address,
      to which will be stake applied after successfull autentification*/
    struct Stake{
        uint256 amount;
        address nodeAddress;
    }

    /*We define 3 types of user status*/
    enum Status { UNAUTHORIZED, WAITING, AUTHORIZED }

    string private name;
    string private symbol;
    uint8 private decimals;

    uint256 private constant TOKEN_PRICE = 1 wei;

    /* storing user balances of tokens */
    mapping(address => uint256) userBalance;

    /* storing user statuses */
    mapping(address => Status) userStatus;

    /* storing information about staking */
    mapping(address => Stake) stakeMap;

    address private authService = 0x0000000000000000000000000000000000000000;
    address private owner = 0x0000000000000000000000000000000000000000;

    constructor() public {
        name = "StakeAllContract";
        symbol = "SAC";
        decimals = 0;
        owner = msg.sender;
    }

    modifier userWithBalance() {
        require(userBalance[msg.sender] > 0, "Only user with balance greater than 0 can call this.");
        _;
    }

    modifier userNotAwaiting() {
        require(userStatus[msg.sender] != Status.WAITING, "Only user who is not awaiting can call this.");
        _;
    }

    modifier userNotStaking() {
        require(stakeMap[msg.sender].amount == 0, "Only user who is not staking anything can call this.");
        _;
    }

    function getName() public view returns (string memory tokenName){
        return name;
    }

    function getSymbol() public view returns (string memory tokenSymbol){
        return symbol;
    }

    function getDecimals() public view returns (uint tokenDecimals){
        return decimals;
    }

     function getContractbalance() public view returns (uint256 balance){
        return userBalance[address(this)];
    }

    function getBalance() public view returns (uint256 balance){
        return userBalance[msg.sender];
    }

    function getUserStatus(address _userAddress) public view returns (Status status){
        return userStatus[_userAddress];
    }

    function setAuthService(address authServiceAddress) public {
        require(msg.sender == owner);
        authService = authServiceAddress;
    }

    function nodeAuthorized(address _nodeAddress) public view returns (bool authorized){
        return IAuthContract(authService).getNodeAuthStatus(_nodeAddress);
    }

    function askPermission(address _baseStationAddress) public userWithBalance userNotAwaiting userNotStaking{
        require(nodeAuthorized(_baseStationAddress), "Node is not authorized to perform authentification");
        userBalance[address(this)] += userBalance[msg.sender];
        stakeMap[msg.sender] = Stake(userBalance[msg.sender], _baseStationAddress);
        userBalance[msg.sender] = 0;
        userStatus[msg.sender] = Status.WAITING;

        emit OrderCreated(msg.sender);
    }

    function askPermissionRemoval() public {
        require(userStatus[msg.sender] != Status.UNAUTHORIZED, "User is unauthorized!");
        if(userStatus[msg.sender] == Status.WAITING){
            userBalance[address(this)] -= stakeMap[msg.sender].amount;
            userBalance[msg.sender] += stakeMap[msg.sender].amount;
            delete stakeMap[msg.sender];
            userStatus[msg.sender] = Status.UNAUTHORIZED;
        } else {
            emit OrderAskedToBeRemoved(msg.sender, stakeMap[msg.sender].nodeAddress);
        }
    }

    function approve(address _userAddress) public {
        require(nodeAuthorized(msg.sender), "Node is not authorized to perform authentification");
        require(stakeMap[_userAddress].nodeAddress == msg.sender, "Staking is not set to this address. You are not allowed for this operation!");
        require(stakeMap[_userAddress].amount > 0, "No staking amount set. Cannot be approved!");

        userStatus[_userAddress] = Status.AUTHORIZED;

        emit PermissionApproved(_userAddress);
    }

    function decline(address _userAddress) public {
        require(stakeMap[_userAddress].nodeAddress == msg.sender, "Staking is not set to this address. You are not allowed for this operation!");
        require(userStatus[_userAddress] == Status.WAITING, "User is not awaiting, cannot be declined!");

        userBalance[address(this)] -= stakeMap[_userAddress].amount;
        userBalance[_userAddress] += stakeMap[_userAddress].amount;
        delete stakeMap[_userAddress];
        userStatus[_userAddress] = Status.UNAUTHORIZED;

        emit OrderDeclined(_userAddress);
    }

    function removePermission(address _userAddress, uint256 _amount) public {
        require(stakeMap[_userAddress].nodeAddress == msg.sender, "Staking is not set to this address. You are not allowed for this operation!");
        require(stakeMap[_userAddress].amount >= _amount, "Amount exceeds amount of stake!");
        require(userStatus[_userAddress] == Status.AUTHORIZED, "Permission cannot be taken to unauthorized user");

        userBalance[address(this)] -= stakeMap[_userAddress].amount;
        userBalance[msg.sender] += _amount;
        userBalance[_userAddress] -= stakeMap[_userAddress].amount - _amount;

        delete stakeMap[_userAddress];

        userStatus[_userAddress] = Status.UNAUTHORIZED;

        emit PermissionRemoved(msg.sender);
    }

    function buyTokens(uint numberOfTokens) external payable {
        require(msg.value > 0 && numberOfTokens > 0);

        uint256  finalPrice = numberOfTokens * TOKEN_PRICE;

        if(finalPrice <= msg.value){
            userBalance[msg.sender] += numberOfTokens;
            emit BuySuccessful(msg.sender);
            uint256 toReturn = msg.value - finalPrice;
            if(toReturn > 0){
                address(msg.sender).transfer(toReturn);
            }
        }
        emit BuyFailed(msg.sender);
    }

    function sellTokens(uint numberOfTokens) external payable {
        require(numberOfTokens > 0);

        uint256 finalAmount = numberOfTokens;

        if(numberOfTokens > userBalance[msg.sender]){
            finalAmount = userBalance[msg.sender];
        }

        if(finalAmount > 0){
            address(msg.sender).transfer(finalAmount * TOKEN_PRICE);
            userBalance[msg.sender] -= finalAmount;
            emit SellSuccessful(msg.sender);
        }
        emit SellFailed(msg.sender);
    }

    event OrderCreated(address indexed _spender);
    event PermissionApproved(address indexed _spender);
    event OrderDeclined(address indexed _spender);
    event OrderAskedToBeRemoved(address indexed _spender, address indexed _nodeAddress);
    event PermissionRemoved(address indexed _spender);
    event BuySuccessful(address indexed _buyer);
    event BuyFailed(address indexed _buyer);
    event SellSuccessful(address indexed _buyer);
    event SellFailed(address indexed _buyer);
}
