pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

interface InterfaceGameObject {
    function takeAttack(uint attackerPower, address attacker) external;
}
