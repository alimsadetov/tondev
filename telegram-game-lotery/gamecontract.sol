pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

contract gamecontract {


    modifier checkOwnerAndAccept {
		tvm.accept();
		_;
	}

    function sendTransactionWithComission(address dest, uint128 value) public pure checkOwnerAndAccept {
        dest.transfer(value, true, 1);
    }

    function sendTransaction(address dest, uint128 value) public pure checkOwnerAndAccept {
        dest.transfer(value, true, 0);
    }

    function sendTransactionAndDeleteContract(address dest) public pure checkOwnerAndAccept {
        dest.transfer(1000000, true, 160);
    }

    function sendValue(address dest, uint128 value) public pure checkOwnerAndAccept {
        dest.transfer(value, false, 1);
    }
}
