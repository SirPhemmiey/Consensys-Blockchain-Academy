pragma solidity ^0.4.13;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SupplyChain.sol";

contract TestSupplyChain {

    SupplyChain supplyChain = SupplyChain(DeployedAddresses.SupplyChain());

    // Test for failing conditions in this contracts
    // test that every modifier is working

    // buyItem
    // test for failure if user does not send enough funds - modifier - paidEnough
    function testBuyItemWithLessFunds() public {
        supplyChain.addItem("laptop", 1 ether);
        bool result = helperBuyItem(1 finney, 0);
        Assert.isFalse(result, "Can't buy item with insufficient funds");
    }
    
    // test for purchasing an item that is not for Sale  - modifier - forSale
    function testBuyItemWhichIsNotForSale() public {
        //SupplyChain sc = new SupplyChain();
        bool _ = helperBuyItem(1 ether, 0);
        bool r = helperBuyItem(1 ether, 0);
        Assert.isFalse(r, "Can't buy an item that is not for sale");        
    }

    // shipItem

    // test for calls that are made by not the seller
    function testShipItemVerifyCaller() public {
        //create new supply chain contract (new addr) and call shipItem()from there for sku=0
        SupplyChain sc = new SupplyChain();
        bool result = helperShipItem(address(sc),0);
        Assert.isFalse(result, "Only seller can call ShipItem()");
    }
    // test for trying to ship an item that is not marked Sold
    function testShipItemWhichIsNotSold() public {
        supplyChain.addItem("book",1 finney);
        bool result = helperShipItem(address(supplyChain),1);
        Assert.isFalse(result, "Can't ship an item that is not sold!");
    }
    // receiveItem

    // test calling the function from an address that is not the buyer
    function testOnlyBuyerCanReceiveItem() public {
        supplyChain.shipItem(0);
        //buyer is this contract.
        //create a new addr ( a new sc contract) and call receiveItem() for sku=0 from there!
        SupplyChain sc = new SupplyChain();
        bool res = helperReceiveItem(address(sc),0);
        Assert.isFalse(res, "Only buyer can receive the sold item!");
    }
    // test calling the function on an item not marked Shipped
    function testOnlyShippedItemCanBeReceived() public {
        bool res = helperReceiveItem(address(supplyChain),1);
        Assert.isFalse(res, "Can't receive an item that is not shipped!");
    }

    /*HELPER METHODS*/
    function helperBuyItem(uint price, uint sku) public returns (bool r) {
        r = address(supplyChain).call.value(price)(bytes4(keccak256("buyItem(uint)", uint(sku))));
    }

    function helperShipItem(address supplyChainAddr, uint sku) 
    public 
    returns (bool r) 
    {
        r = address(supplyChainAddr).call(bytes4(keccak256("shipItem(uint)", uint(sku))));
    }

    function helperReceiveItem(address supplyChainAddr, uint sku) 
    public 
    returns (bool r)
    {
        r = address(supplyChainAddr).call(bytes4(keccak256("receiveItem(uint)", uint(sku))));
    }  
}


// Proxy contract for testing throws
/*
contract ThrowProxy {
    address public target;
    bytes data;

    constructor(address _target) public {
        target = _target;
    }

    //prime the data using the fallback function.
    function() public {
        data = msg.data;
    }

    function execute(uint price) public returns (bool) {
        return target.call.value(price)(data);
    }
}*/