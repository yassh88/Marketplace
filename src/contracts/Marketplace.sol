pragma solidity ^0.5.0;

contract Marketplace {
  string public name;
  uint public productCounts = 0;

  mapping(uint => Product) public products;

  struct Product{
    uint id;
    string name;
    uint price;
    address payable owner;
    bool purchased;
  }

  event ProductCreated(
    uint id,
    string name,
    uint price,
    address payable owner,
    bool purchased
  );

  event ProductPurchased(
    uint id,
    string name,
    uint price,
    address payable owner,
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

  function purchaseProduct(uint _id) public payable{
      // featch the product
    Product memory _product = products[_id];
      // fetch the owener
    address payable _seller = _product.owner;
      // make sure product has valud id
      require(_product.id> 0 && _product.id <= productCounts);
      // Required enough ether in blacnec
      require(msg.value >= _product.price);
      // Required _product not pruchesed
      require(!_product.purchased);

      // Required buyer in saller not pruchesed
      require(_seller != msg.sender);

      // transfer owner ship to buyer
    _product.owner = msg.sender;
        // marked as purchesed 
    _product.purchased = true;
       //update the product
    products[_id] = _product;
      // pya the seller by sending them ether
    address(_seller).transfer(msg.value);
    emit ProductPurchased(productCounts,_product.name,_product.price, msg.sender, _product.purchased);


  }
}