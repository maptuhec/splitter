var Splitter = artifacts.require("./Splitter.sol")
const util = require('./utils');
const expectThrow = util.expectThrow;

contract('Splitter', function(accounts) {

  var contract;
  var owner = accounts[0];
  var bob = accounts[1];
  var carol = accounts[2];
  var valueSend = 1000;
  var oddValueSend = 1001;

  beforeEach(function() {
    return Splitter.new(bob, carol, {from:owner}).then(function(instance) {
      contract = instance;
    });
  });

  it("should be owned by owner" , async function() {
    let _owner = await contract.owner({from: owner});
      assert.strictEqual(_owner, owner, "contract is not owned by owner");

  });

  it("should get balance", async function() {
    let personBalance = await contract.getBalance(owner);
      assert.equal(personBalance.toString("10"), 0, "Owner balance is not correct");
    });

  it("should split value to bob and carol", async function() {
      await contract.splitValue({from: owner, value:valueSend});
      const balanceBobAfter = await contract.balances(bob);
      const balanceCarol = await contract.balances(carol);
      const balanceOwner = await contract.balances(owner);
      assert.equal(balanceBobAfter.toString("10"), 500, "Bob's balance is incorrect");
      assert.equal(balanceCarol.toString("10"), 500, "Carol's balance is incorrect");
      assert.equal(balanceOwner.toString("10"), 0, "Owner's balance is incorrect");
  })

  it("should split odd value to bob and carol", async function() {
    await contract.splitValue({from: owner, value:oddValueSend});
    const balanceBobAfter = await contract.balances(bob);
    const balanceCarol = await contract.balances(carol);
    const balanceOwner = await contract.balances(owner);
    assert.equal(balanceBobAfter.toString("10"), 500, "Bob's balance is incorrect");
    assert.equal(balanceCarol.toString("10"), 500, "Carol's balance is incorrect");
    assert.equal(balanceOwner.toString("10"), 1, "Owner's balance is incorrect");
  })

  it("should kill the contract", async function() {
    const killed = await contract.killSwitch({from: owner});
    assert.equal(!!killed, true, "Contract not killed properly");
  });

  it("should withdraw persons balance", async function() {
    await contract.splitValue({from: owner, value:oddValueSend});
    const balanceOwner = await contract.balances(owner);
    await contract.withdraw(accounts[0], {from: owner});
    const person  = await contract.balances(accounts[0]);
    assert.equal(person.toString("10"), 0, "Person's withdraw has failed");
  });

  it("should trwoh if persons balance is zero ", async function() {
    await expectThrow(contract.withdraw(owner, {from: owner}));
  })

  it("should throw if the sender is not the owner", async function() {
    await expectThrow(contract.splitValue({from: accounts[4], value: valueSend }));
  });

  it("should throw if the msg value is zero", async function() {
    await expectThrow(contract.splitValue({from: owner, value: 0 }));
  });

  it("should throw and not kill the contract if sender is not the owner", async function() {
    await expectThrow(contract.killSwitch({from: accounts[4]}));
  });

  it("should emit event on splitting with value", async function() {
    const expectedEvent = 'LogSplitting';
    let result = await contract.splitValue({
      from: owner,
      value: valueSend
    });
    assert.lengthOf(result.logs, 1, "There should be 1 event emitted from splitting!");
    assert.strictEqual(result.logs[0].event, expectedEvent, `The event emitted was ${result.logs[0].event} instead of ${expectedEvent}`);
  })

  it("should emit event on splitting with odd value", async function() {
    const expectedEvent = 'LogSplitting';
    let result = await contract.splitValue({
      from: owner,
      value: oddValueSend
    });
    assert.lengthOf(result.logs, 1, "There should be 1 event emitted from the splitting!");
    assert.strictEqual(result.logs[0].event, expectedEvent, `The event emitted was ${result.logs[0].event} instead of ${expectedEvent}`);
  })

  it("should emit event on kiling the contract", async function() {
    const expectedEvent = 'LogKillContract';
    let result = await contract.killSwitch({
      from: owner
    });

    assert.lengthOf(result.logs, 1, "There should be 1 event emitted from killing the contract!");
    assert.strictEqual(result.logs[0].event, expectedEvent, `The event emitted was ${result.logs[0].event} instead of ${expectedEvent}`);
  })

  it("should emit event on withdraw", async function() {
    await contract.splitValue({from: owner, value:oddValueSend});
    const balanceBob = await contract.balances(bob);
    const expectedEvent = 'LogWithdraw';
    let result = await contract.withdraw(bob,{
      from: owner
    });

    assert.lengthOf(result.logs, 1, "There should be 1 event emitted from withdrawing!");
    assert.strictEqual(result.logs[0].event, expectedEvent, `The event emitted was ${result.logs[0].event} instead of ${expectedEvent}`);
  })

  });
