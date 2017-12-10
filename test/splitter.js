var Splitter = artifacts.require("./Splitter.sol")

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

  it("should be owned by owner" , function() {
    var owner = accounts[0];
    return contract.owner({from: owner}).then(function(_owner) {
      assert.strictEqual(_owner, owner, "contract is not owned by owner");
    });
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

  });
