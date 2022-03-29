// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0;

contract MultiLevelAuthContract {
    string private name;
    string private symbol;

    struct Auth{
        address parent;
        bool authentificated;
    }

    /* maping addresses to the balances associated with them */
    mapping(address => bool) nodes;

    /* maping allowed amounts of tokens to specific addresses */
    mapping(address => mapping (address => bool)) permissionMap;

    constructor() public {
        name = "MultiLevelAuth";
        symbol = "MLA";
        nodes[msg.sender] = true;
    }

    modifier onlyNode() {
        require(
            nodes[msg.sender],
            "Only contract owner can call this."
        );
        _;
    }

    modifier isChild(address _nodeAddress) {
        require(
            permissionMap[msg.sender][_nodeAddress] == true,
            "You can deactivate only your child node!"
        );
        _;
    }

    function getName() public view returns (string memory tokenName){
        return name;
    }

    function getSymbol() public view returns (string memory tokenSymbol){
        return symbol;
    }

    function getNodeAuthStatus(address _nodeAddress) public view returns (bool authentificated) {
        return nodes[_nodeAddress];
    }

    function activateNode(address _nodeAddress, bool activation) public onlyNode{
        if(!activation){
            require( permissionMap[msg.sender][_nodeAddress] == true, "You can deactivate only your child node!");
        }
        nodes[_nodeAddress] = activation;
        permissionMap[msg.sender][_nodeAddress] = activation;
    }

    function removeNode(address _nodeAddress) public onlyNode isChild(_nodeAddress){
        delete nodes[_nodeAddress];
        permissionMap[msg.sender][_nodeAddress] = false;
    }
}
