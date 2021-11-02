pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

import "game_object.sol";
import "base.sol";
import "interface_game_object.sol";

abstract contract WarUnit is GameObject{
    address basestation;

    constructor(Base base) public {
        base.addWarUnit(this);
        basestation = base;
    }

    function attack(InterfaceGameObject gameobj) public {
        gameobj.takeAttack(attackPower, this);
    }

    function getAttackPower(uint val) virtual external override;

    function getProtectionPower(uint val) virtual external override;

    function death(address winner) public override{
        basestation.removeWarUnit(this);
        this.sendValueToWinner(winner);
    }



}
