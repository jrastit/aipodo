// Aipodo.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

struct Item { 
   uint256 hash;
   uint256 price;
   address owner;
   uint256 full_price;
   uint256[] parents;
}

contract Aipodo /* is ERC20 */{

    event ItemCreated(uint256 hash, uint256 full_price, address owner, uint256[] parents);
    event ItemBuy(uint256 hash, uint256 price, address buyer);
    event ItemPay(uint256 hash, uint256 amount);

    /*
    constructor(uint256 initialSupply) ERC20("Gold", "GLD") {
        _mint(msg.sender, initialSupply);
    }
    */

    constructor() {
        add_item(1, 1, new uint256[](0));
        add_item(2, 2, new uint256[](0));
        uint256[] memory tmp = new uint256[](2);
        tmp[0] = 1;
        tmp[1] = 2;
        add_item(3, 3, tmp);
    }

    mapping(uint256 => Item) private item_list;
    mapping(address => uint256[]) private owned_list;
    mapping(address => uint256) private balance_list;
    mapping(address => string) private owner_proof;

    uint256[] public item_list_array;

    function add_proof(string memory _proof) public {
        owner_proof[msg.sender] = _proof;
    }

    function get_proof(address _owner) public view returns (string memory){
        return owner_proof[_owner];
    }

    function add_item(uint256 _hash, uint256 _price, uint256[] memory _parents) public {
        require (item_list[_hash].hash == 0, 'Item already present');
        item_list[_hash].hash = _hash;
        item_list[_hash].parents = new uint256[](_parents.length);
        uint256 full_price = _price;
        for (uint i=0; i< _parents.length; i++) {
            require (item_list[_parents[i]].hash != 0, 'Parent not found');
            item_list[_hash].parents[i] = _parents[i];
            full_price = full_price + item_list[_parents[i]].full_price;
        }
        item_list[_hash].price = _price;
        item_list[_hash].full_price = full_price;
        item_list[_hash].owner = msg.sender;
        item_list_array.push(_hash);
        emit ItemCreated(_hash, full_price, msg.sender, _parents);
    }

    function get_price(uint256 _hash) public view returns (uint256) {
        require (item_list[_hash].hash != 0, 'Item not found');
        return item_list[_hash].full_price;
    }

    function pay_item(uint256 amount, Item storage item) private returns (uint256){
        amount = amount - item.price;
        balance_list[item.owner] = item.price + balance_list[item.owner];
        emit ItemPay(item.hash, item.price);
        for (uint i=0; i < item.parents.length; i++) {
            amount = pay_item(amount, item_list[item.parents[i]]);
        }
        return amount;
    }

    function buy_item(uint256 _hash) public payable {
        require (item_list[_hash].hash != 0, 'Item not found');
        require (msg.value >= item_list[_hash].full_price, 'Not enought found');
        uint256 amount = pay_item(msg.value, item_list[_hash]);
        balance_list[item_list[_hash].owner] = amount + balance_list[item_list[_hash].owner];
        emit ItemPay(_hash, amount);
        emit ItemBuy(_hash, msg.value, msg.sender);
        owned_list[msg.sender].push(_hash);
    }

    function get_item_list() public view returns (uint256[] memory){
        return item_list_array;
    }

    function get_item(uint256 _hash) public view returns (
        uint256 hash,
        uint256 price,
        address owner,
        uint256 full_price,
        uint256[] memory parents
    ){
        require(item_list[_hash].hash != 0, 'Item not found');
        hash = item_list[_hash].hash;
        price = item_list[_hash].price;
        owner = item_list[_hash].owner;
        full_price = item_list[_hash].full_price;
        parents = item_list[_hash].parents;
    }

    function get_owner_item() public view returns (uint256[] memory){
        return owned_list[msg.sender];
    }

    function my_balance() public view returns (uint256){
        return balance_list[msg.sender];
    }

    function withdraw() public {
        payable(msg.sender).transfer(balance_list[msg.sender]);
        balance_list[msg.sender] = 0;
    }
}