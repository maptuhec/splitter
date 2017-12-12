pragma solidity ^0.4.18;
contract Splitter {

  //TODO: Add modifier for onlyOwner

    address public owner;
    address public bob;
    address public carol;

    mapping (address => uint ) public balances;

    event LogSplitting(address sender, uint amountToSplit);
    event LogKillContract(address sender);
    event LogWithdraw(address person);

    function Splitter(address addressBob, address addressCarol) public {
        owner = msg.sender;
        bob = addressBob;
        carol = addressCarol;
    }

    function getBalance(address person) constant public returns(uint) {
        return balances[person];
    }

    function splitValue() payable public {
        require(msg.sender == owner);
        require(msg.value != 0);

        uint splittedValue = msg.value / 2;
		uint remainder = msg.value - (splittedValue * 2);

		balances[owner] += remainder;
		balances[bob] += splittedValue;
		balances[carol] += splittedValue;

		LogSplitting(owner, msg.value);
    }

    function killSwitch() public {
        require(msg.sender == owner);
        LogKillContract(owner);
        selfdestruct(owner);
    }

    function withdraw(address person) public {
        require(balances[person] > 0);
        person.transfer(balances[person]);
        balances[person] = 0;
        LogWithdraw(person);
    }
}
