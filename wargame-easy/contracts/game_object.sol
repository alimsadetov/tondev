pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

import "interface_game_object.sol";

abstract contract GameObject is InterfaceGameObject{
    int public hp = 10;
    uint public attackPower=0;
    uint public protectionPower=0;

    function getProtectionPower(uint val) virtual external;
    function getAttackPower(uint val) virtual external;

    function takeAttack(uint attackerPower, address attacker) external override{
        tvm.accept();
        if (attackerPower > protectionPower){
            hp = hp - (int(attackerPower) - int(protectionPower));
            isDead(attacker);
        }
    }

    function isDead(address attacker) private{
        tvm.accept();
        if (hp<=0){
            this.death(attacker);
        }
    }

    function death(address attacker) public {
        tvm.accept();
        attacker.transfer(1000000,true, 160);
    }

}
