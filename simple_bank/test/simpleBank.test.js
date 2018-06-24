var SimpleBank = artifacts.require("./SimpleBank.sol")
//const truffleAssert = require('truffle-assertions'); $npm install -g truffle-assertions

contract('SimpleBank', function(accounts) {

  const owner = accounts[0]
  const alice = accounts[1]
  const bob = accounts[2] 

  it("should put 1000 tokens on enroll for both accounts", async() => {

    const bank = await SimpleBank.deployed()
    await bank.enroll({from: alice})
    await bank.enroll({from: bob})

    var aliceBalance = await bank.balance.call({from: alice})
    aliceBalance = aliceBalance.toNumber()
    var bobBalance = await bank.balance.call({from: bob})
    bobBalance = bobBalance.toNumber()

    assert.equal(aliceBalance, 1000, 'enroll balance is incorrect, check balance method or constructor');

    assert.equal(bobBalance, 1000, 'enroll balance is incorrect, check balance method or constructor');
/*
    const ownerBalance = bank.balance({from: owner})
    assert.equal(ownerBalance, 0, 'only enrolled users should have balance, check balance method or constructor')*/

  })
  /*

  it("should put 1000 tokens in the first and second account", async () => {
    const bank = await SimpleBank.deployed();

    await bank.enroll({from: alice});
    await bank.enroll({from: bob});

    const aliceBalance = await bank.balance({from: alice});
    assert.equal(aliceBalance, 1000, 'enroll balance is incorrect, check balance method or constructor');

    const bobBalance = await bank.balance({from: bob});
    assert.equal(bobBalance, 1000, 'enroll balance is incorrect, check balance method or constructor');

    const ownerBalance = await bank.balance({from: owner});
    assert.equal(ownerBalance, 0, 'only enrolled users should have balance, check balance method or constructor')
  });
*/
  it("should deposit correct amount", async () => {
    const bank = await SimpleBank.deployed();
    const deposit = 2 

    await bank.enroll({from: alice});
    await bank.enroll({from: bob});
    
    var balanceBefore = await bank.balance.call({from: alice })
    balanceBefore = balanceBefore.toNumber() //1000

    let tx = await bank.deposit({from: alice, value: deposit});
	
    var balanceAfter = await bank.balance.call({from: alice});
    balanceAfter = balanceAfter.toNumber() //1002

    assert.equal(balanceAfter, balanceBefore+deposit, 'deposit amount incorrect, check deposit method');

    /*
    ANOTHER WAY:-
    const deposit = web3.toBigNumber(2);
    await bank.enroll({from: alice});
    await bank.enroll({from: bob});    
    await bank.deposit({from: alice, value: deposit});
    const balance = await bank.balance({from: alice }) //bigNumber 
    assert.equal(deposit.plus(1000).toString, balance, 'deposit amount incorrect, check deposit method');
    */

    //CHECK FOR LOG-DEPOSIT EVENT
	//WAY 1 - BEST WAY
	//TRY await console.log(tx.logs)
	var eventName = await tx.logs[0].event
	var eventAddress = await tx.logs[0].args.accountAddress
	var eventAmount = await tx.logs[0].args.amount
	eventAmount = eventAmount.toNumber()	
	
	assert.equal(eventName, 'LogDepositMade', 'event Name incorrect. check tx.logs')
	assert.equal(eventAddress, alice, 'event address and sender address dont match.')
	assert.equal(eventAmount, deposit, 'amount deposit isn\'t right')
	
    /*WAY2: 
    const expectedEventResult = {   //enum
      accountAddress: alice, 
      amount: deposit //big number format.
    }

    const LogDepositMade = await bank.allEvents()
    const log = await new Promise(
      (resolve, reject) => {
        LogDepositMade.watch(
          (error, res) => { 
            resolve(res) 
        })
      })

      //NOTE TRY -> await console.log(log)

    const logAccountAddress = log.args.accountAddress;
    const logAmount = log.args.amount; //bigNumber format
    assert.equal(logAccountAddress, expectedEventResult.accountAddress, "LogDepositMade event accountAddress property not emmitted, check deposit method");
    assert.equal(logAmount, expectedEventResult.amount, "LogDepositMade event amount property not emmitted, check deposit method");
	*/

    /* WAY3:
    let tx = await bank.deposit({from: alice, value: deposit})    
    truffleAssert.eventEmitted(tx, 'LogDepositMade', (ev) => {
      return ev.accountAddress === alice && ev.amount === deposit })
    */
  })
  
  it("should withdraw correct amount", async () => {
    const bank = await SimpleBank.deployed();
    const deposit = 2

    const initialAmount = 1000;

    await bank.enroll({from: alice});
    await bank.enroll({from: bob});

    await bank.deposit({from: alice, value: deposit});
    await bank.withdraw(deposit, {from: alice});

    var balance = await bank.balance.call({from: alice});
    balance = balance.toNumber()

    assert.equal(initialAmount, balance, 'withdraw amount incorrect, check withdraw method');

    
    /* ANOTHER WAY using .toBigNumber:
    const deposit = web3.toBigNumber(2);
    const initialAmount = 1000;

    await bank.enroll({from: alice});
    await bank.enroll({from: bob});

    await bank.deposit({from: alice, value: deposit});
    await bank.withdraw(deposit, {from: alice});

    const balance = await bank.balance({from: alice});

    assert.equal(initialAmount.toString(), balance, 'withdraw amount incorrect, check withdraw method');
    */
  });

});
