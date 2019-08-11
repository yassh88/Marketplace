pragma solidity ^0.5.0;

contract Marketplace {
  string public name;
  uint public productCounts = 0;

  mapping(uint => Product) public products;

  struct Product{
    uint id;
    string name;
    uint price;
    address owner;
    bool purchased;
  }

  event ProductCreated(
    uint id,
    string name,
    uint price,
    address owner,
    bool purchased
  );
  constructor() public {
    name = "Yahswnat";
  }

  function createProduct(string memory _name, uint _price) public{
    require(bytes(_name).length > 0);
    require(_price > 0);
    productCounts++;
    products[productCounts] = Product(productCounts,_name,_price,msg.sender,false);
    emit ProductCreated(productCounts,_name,_price,msg.sender,false);
  }
}