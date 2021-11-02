pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

import "interface_game_object.sol";


contract GameObject is InterfaceGameObject{
    int public hp = 10;
    uint public attackPower;
    uint public protectionPower;

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

    function death(address attacker) virtual public;

    function sendValueToWinner(address winner) public {
        tvm.accept();
        winner.transfer(1000000,true, 160);
    }


}
