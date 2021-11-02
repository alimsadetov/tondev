pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

import "war_unit.sol";

contract Warrior is WarUnit{

    function getAttackPower(uint val) public override{
        attackPower = val;
    }

    function getProtectionPower(uint val) public override{
        protectionPower = val;
    }
}