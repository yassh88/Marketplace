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
   let result, count;
  before(async () => {
    result = await marketplace.createProduct('iphonex', web3.utils.toWei('1', 'Ether'), {from:seller})
    count = await marketplace.productCounts()
  });

  it('create products', async ()=>{
  // success
   assert.equal(count, 1);
   const event = result.logs[0].args
   assert.equal(event.id.toNumber(), count.toNumber(),'id correct');
   assert.equal(event.name, 'iphonex', 'name is correct');
   assert.equal(event.price, '1000000000000000000', '');
   assert.equal(event.owner, seller, 'owner is correct');
   assert.equal(event.purchased, false, 'purchased is correct');

   // Fail
   await await marketplace.createProduct('', web3.utils.toWei('1', 'Ether'), {from:seller})
 });
});




}) ;