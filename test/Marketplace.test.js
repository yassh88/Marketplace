const Marketplace = artifacts.require("./Marketplace.sol");

require('chai').use(require('chai-as-promised')).should()
contract('Marketplace',([deployer, seller, buyer])=>{
 let marketplace;

 before(async () =>{
   marketplace = await Marketplace.deployed();
 });
 describe('deployment', async ()=>{
   it('deploye successfully', async ()=>{
     const addrees = await marketplace.address;
     assert.notEqual(addrees, 0x0);
     assert.notEqual(addrees, '');
     assert.notEqual(addrees, null);
     assert.notEqual(addrees, undefined);
   });

   it('it Has a name', async ()=>{
    const name = await marketplace.name();
    assert.equal(name, 'Yahswnat');
  });
 });

 describe('products', async ()=>{
   let result, productCount;
  before(async () => {
    result = await marketplace.createProduct('iphonex', web3.utils.toWei('1', 'Ether'), {from:seller})
    productCount = await marketplace.productCounts()
  });

  it('create products', async ()=>{
    // success
    assert.equal(productCount, 1);
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), productCount.toNumber(),'id correct');
    assert.equal(event.name, 'iphonex', 'name is correct');
    assert.equal(event.price, '1000000000000000000', '');
    assert.equal(event.owner, seller, 'owner is correct');
    assert.equal(event.purchased, false, 'purchased is correct');

    // fail
    await marketplace.createProduct('', web3.utils.toWei('1', 'Ether'), {from:seller}).should.be.rejected;
  });
  it('List products', async ()=>{
    const product = await marketplace.products(productCount);
    
    assert.equal(product.id.toNumber(), productCount.toNumber(),'id correct');
    assert.equal(product.name, 'iphonex', 'name is correct');
    assert.equal(product.price, '1000000000000000000', '');
    assert.equal(product.owner, seller, 'owner is correct');
    assert.equal(product.purchased, false, 'purchased is correct');
    
  });

  it('Sells Products', async () => {
    // Track the seller balance before purchases
    let oldSellerBalance;
    oldSellerBalance = await web3.eth.getBalance(seller)
    oldSellerBalance = new web3.utils.BN(oldSellerBalance);

    //success buyer purchased 
    result  = await marketplace.purchaseProduct(productCount, {from:buyer, value: web3.utils.toWei('1', 'Ether')})

    // check logs
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), productCount.toNumber(),'id correct');
    assert.equal(event.name, 'iphonex', 'name is correct');
    assert.equal(event.price, '1000000000000000000', '');
    assert.equal(event.owner, buyer, 'owner is correct');
    assert.equal(event.purchased, true, 'purchased is correct');

    // check seller received ether
    let newSellerBalance;
    newSellerBalance = await web3.eth.getBalance(seller)
    newSellerBalance = new web3.utils.BN(newSellerBalance);

    let price;
    price =  web3.utils.toWei('1', 'Ether');
    price =new  web3.utils.BN(price);
    const expectedBalance = oldSellerBalance.add(price)
    assert.equal(newSellerBalance.toString(), expectedBalance.toString(), 'seller account credited');


    //failure try to buy product which not exist
    await marketplace.purchaseProduct(99, {from:buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
    await marketplace.purchaseProduct(productCount, {from:buyer, value: web3.utils.toWei('0.5', 'Ether')}).should.be.rejected;
    await marketplace.purchaseProduct(productCount, {from:deployer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
    await marketplace.purchaseProduct(productCount, {from:buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
  });
});




}) ;