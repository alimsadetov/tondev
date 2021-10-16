pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

contract contract_2_1 {

	uint public mult = 1;

	constructor() public {
		// check that contract's public key is set
		require(tvm.pubkey() != 0, 101);
		// Check that message has signature (msg.pubkey() is not zero) and message is signed with the owner's private key
		require(msg.pubkey() == tvm.pubkey(), 102);
		tvm.accept();
	}

	// Modifier that allows to accept some external messages
	modifier checkOwnerAndAccept {
		// Check that message was signed with contracts key.
		require(msg.pubkey() == tvm.pubkey(), 102);
		tvm.accept();
		_;
	}


	function multiply(uint value) public checkOwnerAndAccept {
        require((value > 0) && (value<=10), 23);
		mult *= value;
	}
}