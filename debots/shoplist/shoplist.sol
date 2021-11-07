pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;
pragma AbiHeader pubkey;

import "additionals.sol";

contract Shoplist {

    uint32 m_count;
    mapping(uint32 => Purchase) m_purchases;

    uint256 m_ownerPubkey;


    constructor (uint pubkey) public{
        require(pubkey != 0, 120);
        tvm.accept();
        m_ownerPubkey = pubkey;
    }

    modifier onlyOwner() {
        require(msg.pubkey() == m_ownerPubkey, 101);
        _;
    }

    function getStat() public view returns (Stat stat) {
        uint32 buyedCount;
        uint32 unbuyedCount;
        uint summ;

        for((, Purchase purchase) : m_purchases) {
            if  (purchase.isBuyed) {
                buyedCount++;
                summ+=purchase.cost;
            } else {
                unbuyedCount++;
            }
        }
        stat = Stat( buyedCount, unbuyedCount, summ );
    }



    function getPurchases() public view returns (Purchase[] purchases) {
        string name;
        uint32 count;
        uint cost;
        uint64 createdAt;
        bool isBuyed;
    

        for((uint32 id, Purchase purchase) : m_purchases) {
            name = purchase.name;
            isBuyed = purchase.isBuyed;
            createdAt = purchase.createdAt;
            count = purchase.count;
            cost = purchase.cost;
            purchases.push(Purchase(id, name, count, createdAt, isBuyed, cost));
       }
    }




    function addPurchase(string name, uint32 count) public onlyOwner {
        tvm.accept();
        m_count++;
        m_purchases[m_count] = Purchase(m_count, name, count, now, false, 0);
    }

    function removePurchase(uint32 id) public onlyOwner {
        require(m_purchases.exists(id), 102);
        tvm.accept();
        delete m_purchases[id];
    }

    function buyPurchase(uint32 id, uint cost) public onlyOwner {
        optional(Purchase) purchase = m_purchases.fetch(id);
        require(purchase.hasValue(), 102);
        tvm.accept();
        Purchase thisPurchase = purchase.get();
        thisPurchase.isBuyed = true;
        thisPurchase.cost = cost;
        m_purchases[id] = thisPurchase;
    }


}