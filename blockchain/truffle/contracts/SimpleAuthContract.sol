// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0;

contract SimpleAuthContract {
    string private name;
    string private symbol;
    address owner;

     /* maping addresses to the balances associated with them */
    mapping(address => bool) users;

    /* maping addresses to the balances associated with them */
    mapping(address => bool) nodes;

    /* maping allowed amounts of tokens to specific addresses */
    mapping(address => mapping (address => bool)) permissionMap;

    constructor() public {
        name = "SimpleAuth";
        symbol = "SAuth";
        owner = msg.sender;
    }

    modifier onlyOwner() { // Modifier
        require(
            msg.sender == owner,
            "Only contract owner can call this."
        );
        _;
    }

    modifier onlyNode() { // Modifier
        require(
            nodes[msg.sender],
            "Only contract owner can call this."
        );
        _;
    }

    function getName() public view returns (string memory tokenName){
        return name;
    }

    function getSymbol() public view returns (string memory tokenSymbol){
        return symbol;
    }

    function getContractbalance() public view returns (uint256 balance){
        return address(this).balance;
    }

    function getAuth(address _owner) public view returns (bool authentificated) {
        return users[_owner];
    }

    function authentificate(address _spender) public onlyNode {
        users[_spender] = true;
        permissionMap[msg.sender][_spender] = true;
    }

    function expire(address _spender) public onlyNode {
        users[_spender] = false;
        permissionMap[msg.sender][_spender] = false;
    }

    function activateNode(address _nodeAddress, bool activation) public onlyOwner {
        nodes[_nodeAddress] = activation ;
    }

    function removeNode(address _nodeAddress) public onlyOwner {
        delete nodes[_nodeAddress];
    }
}
