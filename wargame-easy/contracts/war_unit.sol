pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

import "game_object.sol";


abstract contract WarUnit is GameObject{

    function attack(InterfaceGameObject gameobj) public {
        tvm.accept();
        gameobj.takeAttack(attackPower, this);
    }



    function getAttackPower(uint val) virtual external override;

    function getProtectionPower(uint val) virtual external override;


}