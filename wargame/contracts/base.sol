pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

import "game_object.sol";


abstract contract Base is GameObject{

    address[] public warUnits;

    constructor (uint protection, int _hp) public{
        tvm.accept();
        protectionPower = protection;
        attackPower = 0;
        hp = _hp;
    }

    function addWarUnit(address warunit) public {
        tvm.accept();
        warUnits.push(warunit);
    }


    function removeWarUnit(address warunit) public {
        tvm.accept();
        for (uint i=0;i<warUnits.length;i++){
            if(warUnits[i]==warunit){
                delete warUnits[i];
            }
        }
    }



    function death(address winner) public override{
        tvm.accept();
        for (uint i=0; i<warUnits.length;i++){
            tvm.accept();
            warUnits[i].sendValueToWinner(winner);
        }
        this.sendValueToWinner(winner);
    }
}
