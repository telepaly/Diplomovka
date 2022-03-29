// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0;

interface IAuthContract {
    function getNodeAuthStatus(address _owner) external view returns (bool authentificated);
}

contract BatchedPermissionContract {
    struct ApprovalAwait {
        bool awaiting;
        address resolverAddress;
    }

    string private name;
    string private symbol;
    uint8 private decimals;

    address private authService = 0x0000000000000000000000000000000000000000;
    address private owner = 0x0000000000000000000000000000000000000000;

    uint256 private constant TOKEN_PRICE = 1 wei; // 1 kB

    mapping(address => uint256) userBalance;

    mapping(address => bool) awaitingPermission;

    mapping(address => bool) authStatus;

    mapping(address => ApprovalAwait) awaitingApproved;

    constructor() public {
        name = "BatchedPermissionContract";
        symbol = "BPC";
        decimals = 0;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only contract owner can call this."
        );
        _;
    }

    modifier userWithBalance() {
        require(
            userBalance[msg.sender] > 0,
            "Only user with balance greater than 0 can call this."
        );
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

    function getAuthStatus(address _nodeAddress) public view returns (bool status){
        return authStatus[_nodeAddress];
    }

    function getContractbalance() public view returns (uint256 balance){
        return userBalance[address(this)];
    }

    function setAuthService(address authServiceAddress) public {
        require(msg.sender == owner);
        authService = authServiceAddress;
    }

    function nodeAuthorized(address _nodeAddress) public view returns (bool authorized){
        return IAuthContract(authService).getNodeAuthStatus(_nodeAddress);
    }

    function askPermission() public userWithBalance {
        userBalance[msg.sender] -= 1;
        userBalance[address(this)] += 1;
        awaitingPermission[msg.sender] = true;

        authStatus[msg.sender] = false;

        if(awaitingApproved[msg.sender].awaiting){
            userBalance[awaitingApproved[msg.sender].resolverAddress] += 1;
            awaitingApproved[msg.sender].awaiting = false;
        }

        emit OrderCreated(msg.sender);
    }

    function permissionResolved(address _spender) public {
        require(nodeAuthorized(msg.sender), "Node is not authorized to perform authentification");

        if(awaitingPermission[_spender]){
            authStatus[msg.sender] = true;
            awaitingPermission[_spender] = false;
            awaitingApproved[_spender] = ApprovalAwait(true, msg.sender);
        }
    }

    function denyPermisson(address _spender) public {
        require(nodeAuthorized(msg.sender), "Node is not authorized to perform authentification");
        if(awaitingPermission[_spender]){
            userBalance[address(this)] -= 1;
            userBalance[_spender] += 1;
            awaitingPermission[_spender] = false;
            awaitingApproved[_spender] = ApprovalAwait(false, msg.sender);
            emit OrderDenied(_spender);
        }
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
    event OrderWaitingForApproval(address indexed _resolver);
    event OrderApproved(address indexed _spender);
    event OrderDenied(address indexed _spender);
    event BuySuccessful(address indexed _buyer);
    event BuyFailed(address indexed _buyer);
    event SellSuccessful(address indexed _buyer);
    event SellFailed(address indexed _buyer);
}
