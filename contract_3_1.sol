pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

contract contract_2_1 {

	string[] public queue;

	constructor() public {
		// check that contract's public key is set
		require(tvm.pubkey() != 0, 101);
		// Check that message has signature (msg.pubkey() is not zero) and message is signed with the owner's private key
		require(msg.pubkey() == tvm.pubkey(), 102);
		tvm.accept();
	}
    modifier checkOwnerAndAccept {
		// Check that message was signed with contracts key.
		require(msg.pubkey() == tvm.pubkey(), 102);
		tvm.accept();
		_;
	}

	function addPersonToQueue(string name) public checkOwnerAndAccept{
        queue.push(name);
	}

    function removePersonFromQueue() public checkOwnerAndAccept{
        if (queue.length!=0){
            for (uint i = 0; i<queue.length-1; i++){
                queue[i] = queue[i+1];
            }
        }
        queue.pop();
    }
}