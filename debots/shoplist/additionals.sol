pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;
pragma AbiHeader pubkey;

struct Purchase {
    uint32 id;
    string name;
    uint32 count;
    uint64 createdAt;
    bool isBuyed;
    uint cost;
}

struct Stat {
    uint32 buyedCount;
    uint32 unbuyedCount;
    uint summ;
}


interface IMsig {
   function sendTransaction(address dest, uint128 value, bool bounce, uint8 flags, TvmCell payload  ) external;
}


abstract contract AShoplist {
   constructor(uint256 pubkey) public {}
}

interface IShoplist {
   function addPurchase(string name, uint32 count) external;
   function buyPurchase(uint32 id, uint cost) external;
   function removePurchase(uint32 id) external;
   function getPurchases() external returns (Purchase[] purchases);
   function getStat() external returns (Stat);
}