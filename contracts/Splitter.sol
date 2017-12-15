pragma solidity ^0.4.18;
contract Splitter {

    address public owner;
    address public bob;
    address public carol;

    mapping (address => uint ) public balances;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

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

    function splitValue() onlyOwner payable public {
        require(msg.value != 0);

        uint splittedValue = msg.value / 2;
		uint remainder = msg.value % 2;

		balances[owner] += remainder;
		balances[bob] += splittedValue;
		balances[carol] += splittedValue;

		LogSplitting(owner, msg.value);
    }

    function killSwitch() onlyOwner public {
        LogKillContract(owner);
        selfdestruct(owner);
    }

    function withdraw() public {
        require(balances[msg.sender] > 0);
        uint valueToWithdraw = balances[msg.sender];
        balances[msg.sender] = 0;
        msg.sender.transfer(valueToWithdraw);
        
        LogWithdraw(msg.sender);
    }
}
