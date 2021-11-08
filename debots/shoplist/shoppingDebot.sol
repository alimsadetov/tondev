pragma ton-solidity >=0.35.0;
pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;

import "additionals.sol";
import "abstractDebot.sol";

contract shoppingDebot is abstractDebot {
    function getDebotInfo() public functionID(0xDEB) override view returns(
        string name, string version, string publisher, string key, string author,
        address support, string hello, string language, string dabi, bytes icon
    ) {
        name = "Shoplist DeBot";
        version = "0.2.0";
        publisher = "Alim Sadetov";
        key = "Shoplist manager";
        author = "Alim Sadetov";
        support = address.makeAddrStd(0, 0x66e01d6df5a8d7677d9ab2daf7f258f1e2a7fe73da5320300395f99e01dc3b5f);
        hello = "Hi, i'm a Shoplist DeBot. I can update your shopping list";
        language = "en";
        dabi = m_debotAbi.get();
        icon = m_icon;
    }

    function _menu() public override{
        string sep = '----------------------------------------';
        Menu.select(
            format(
                "You have {}/{}/{} (not yet paid/already paid/total) items in shoplist, total price: {} dollars",
                    m_stat.unbuyedCount,
                    m_stat.buyedCount,
                    m_stat.buyedCount + m_stat.unbuyedCount,
                    m_stat.summ
            ),
            sep,
            [
                MenuItem("Show shoplist","",tvm.functionId(showPurchases)),
                MenuItem("Buy item from shoplist","",tvm.functionId(buyPurchase)),
                MenuItem("Remove item from shoplist","",tvm.functionId(removePurchase))
            ]
        );
    }







    function showPurchases(uint32 index) public view {
        index = index;
        optional(uint256) none;
        IShoplist(m_address).getPurchases{
            abiVer: 2,
            extMsg: true,
            sign: false,
            pubkey: none,
            time: uint64(now),
            expire: 0,
            callbackId: tvm.functionId(showPurchases_),
            onErrorId: 0
        }();
    }

    function showPurchases_( Purchase[] purchases ) public {
        uint32 i;
        if (purchases.length > 0 ) {
            Terminal.print(0, "Your shoplist:");
            for (i = 0; i < purchases.length; i++) {
                Purchase purchase = purchases[i];
                string buyed;
                if (purchase.isBuyed) {
                    buyed = 'already paid';
                } else {
                    buyed = 'not yet paid';
                }
                Terminal.print(0, format("{}  \"{}\" {}pcs {} at {} for {} dollars", purchase.id, purchase.name, purchase.count, buyed, purchase.createdAt, purchase.cost));
            }
        } else {
            Terminal.print(0, "Your shoplist is empty");
        }
        _menu();
    }

















    function removePurchase(uint32 index) public {
        index = index;
        if (m_stat.buyedCount + m_stat.unbuyedCount > 0) {
            Terminal.input(tvm.functionId(removePurchase_), "Enter item number:", false);
        } else {
            Terminal.print(0, "Sorry, you have no items to remove");
            _menu();
        }
    }

    function removePurchase_(string value) public view {
        (uint256 num,) = stoi(value);
        optional(uint256) pubkey = 0;
        IShoplist(m_address).removePurchase{
                abiVer: 2,
                extMsg: true,
                sign: true,
                pubkey: pubkey,
                time: uint64(now),
                expire: 0,
                callbackId: tvm.functionId(onSuccess),
                onErrorId: tvm.functionId(onError)
            }(uint32(num));
    }











    function buyPurchase(uint32 index) public {
        index = index;
        if (m_stat.buyedCount + m_stat.unbuyedCount > 0) {
            Terminal.input(tvm.functionId(buyPurchase_), "Enter item number:", false);
        } else {
            Terminal.print(0, "Sorry, you have no items to buy");
            _menu();
        }
    }

    function buyPurchase_(string value) public {
        (uint256 num,) = stoi(value);
        m_purchaseId = uint32(num);
        Terminal.input(tvm.functionId(buyPurchase__),"What price you paid for this purchase?", false);
    }


    function buyPurchase__(string value) public view {
        uint costOfPurchase;
        optional(uint256) pubkey = 0;
        (uint num,) = stoi(value);
        costOfPurchase = num;
        IShoplist(m_address).buyPurchase{
                abiVer: 2,
                extMsg: true,
                sign: true,
                pubkey: pubkey,
                time: uint64(now),
                expire: 0,
                callbackId: tvm.functionId(onSuccess),
                onErrorId: tvm.functionId(onError)
            }(m_purchaseId, costOfPurchase);
    }
}