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

  it("should get balance", function() {
    return contract.getBalance(owner).then(function(ownerBalance) {
        assert.equal(ownerBalance.toString("10"), 0, "Owner balance is not correct");
    });
  })

  it("should split value to bob and carol", function() {
    contract.splitValue({from: owner, value:valueSend}).then(function() {
					return contract.balances(bob);
				})
				.then(function(balance) {
					assert.equal(balance.toString("10"), 500, "Bob's balance is incorrect");
					return contract.balances(carol);
				})
				.then(function(balance) {
					assert.equal(balance.toString("10"), 500, "Carol's balance is incorrect");
					return contract.balances(owner);
				})
				.then(function(balance) {
					assert.equal(balance.toString("10"), 0, "Owner's balance is incorrect");
				});
  })

  it("should split odd value to bob and carol", function() {
    contract.splitValue({from: owner, value:oddValueSend}).then(function() {
					return contract.balances(bob);
				})
				.then(function(balance) {
					assert.equal(balance.toString("10"), 500, "Bob's balance was incorrect");
					return contract.balances(carol);
				})
				.then(function(balance) {
					assert.equal(balance.toString("10"), 500, "Carol's balance was incorrect");
					return contract.balances(owner);
				})
				.then(function(balance) {
					assert.equal(balance.toString("10"), 1, "Owner's balance was incorrect");
				});
  })

  it("should kill the contract", function() {
    contract.killSwitch({from: owner}).then(function(killed) {
      assert.equal(!!killed, true, "Contract not killed properly");
    });
  });

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

  });
