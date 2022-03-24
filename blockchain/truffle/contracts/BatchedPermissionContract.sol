// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0;

contract BatchedPermissionContract {
    struct ApprovalAwait {
        bool awaiting;
        address resolverAddress;
    }

    string private name;
    string private symbol;
    uint8 private decimals;
    address owner;

    uint256 private constant PRICE_PER_TOKEN = 1 wei; // 1 kB
    uint256 private constant MAX_ALLOWED_OWNERSHIP = 500000000; // as 500 GB of data

     /* maping addresses to the balances associated with them */
    mapping(address => uint256) userBalance;

    mapping(address => bool) awaitingPermission;

    mapping(address => ApprovalAwait) awaitingApproved;

     constructor() public {
        name = "BatchedPermissionCOntract";
        symbol = "AuthS";
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

     function getContractbalance() public view returns (uint256 balance){
        return userBalance[address(this)];
    }

    function getBalance() public view returns (uint256 balance){
        return userBalance[msg.sender];
    }

    function askPermission() public userWithBalance {
        userBalance[msg.sender] -= 1;
        userBalance[address(this)] += 1;
        awaitingPermission[msg.sender] = true;

        if(awaitingApproved[msg.sender].awaiting){
            userBalance[awaitingApproved[msg.sender].resolverAddress] += 1;
            awaitingApproved[msg.sender].awaiting = false;
        }

        emit OrderCreated(msg.sender);
    }

    function permissionResolved(address _spender) public {
        if(awaitingPermission[_spender]){
            awaitingPermission[_spender] = false;
            awaitingApproved[_spender] = ApprovalAwait(true, msg.sender);
        }
    }

    function denyPermisson(address _spender) public {
        if(awaitingPermission[_spender]){
            userBalance[address(this)] -= 1;
            userBalance[_spender] += 1;
            awaitingPermission[_spender] = false;
            awaitingApproved[_spender] = ApprovalAwait(false, msg.sender);
            emit OrderDenied(_spender);
        }
    }

    function buyTokens(uint numberOfTokens) external payable{
        // buyer needs to sent some ether
        require(msg.value > 0 && numberOfTokens > 0);

        uint256 finalAmount = numberOfTokens;

        if((userBalance[msg.sender] + numberOfTokens) > MAX_ALLOWED_OWNERSHIP){
            finalAmount = MAX_ALLOWED_OWNERSHIP - userBalance[msg.sender];
        }
        uint256  finalPrice = finalAmount * PRICE_PER_TOKEN;

        // amount of wei needs to be adequate to number of desired tokens
        if(finalPrice <= msg.value){
            if(msg.value - finalPrice > 0){
                address(msg.sender).transfer(msg.value - finalPrice);
            }
            userBalance[msg.sender] += finalAmount;
            emit BuySuccessful(msg.sender);
            return;
        }
        emit BuyFailed(msg.sender);
    }

    function sellTokens(uint numberOfTokens) external payable{
        require(numberOfTokens > 0);

        uint256 finalAmount = numberOfTokens;

        if(numberOfTokens > userBalance[msg.sender]){
            finalAmount = userBalance[msg.sender];
        }

        if(finalAmount > 0){
            uint256  finalPrice = finalAmount * PRICE_PER_TOKEN;

            address(msg.sender).transfer(finalPrice);

            userBalance[msg.sender] -= finalAmount;

            emit SellSuccessful(msg.sender);
            return;
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
