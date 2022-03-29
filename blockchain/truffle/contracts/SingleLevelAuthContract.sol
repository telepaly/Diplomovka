// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0;

contract SingleLevelAuthContract {
    string private name;
    string private symbol;
    address private owner;

    /* maping addresses to the auth status associated to them */
    mapping(address => bool) nodes;

    constructor() public {
        name = "SingleLevelAuth";
        symbol = "SLA";
        owner = msg.sender;
        nodes[owner] = true;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
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

    function getNodeAuthStatus(address _owner) public view returns (bool authentificated) {
        return nodes[_owner];
    }

    function activateNode(address _nodeAddress, bool activation) public onlyOwner {
        nodes[_nodeAddress] = activation;
    }

    function removeNode(address _nodeAddress) public onlyOwner {
        delete nodes[_nodeAddress];
    }
}
