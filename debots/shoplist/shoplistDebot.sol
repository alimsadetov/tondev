pragma ton-solidity >=0.35.0;
pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;

import "additionals.sol";
import "../Debot.sol";
import "../Terminal.sol";
import "../Menu.sol";
import "../AddressInput.sol";
import "../ConfirmInput.sol";
import "../Upgradable.sol";
import "../Sdk.sol";


contract ShoplistDebot is Debot, Upgradable {
    bytes m_icon;

    TvmCell public m_todoCode; // TODO contract code
    TvmCell public m_todoData;
    TvmCell public m_todoStateInit;
    address m_address;  // TODO contract address
    Stat m_stat;        // Statistics of incompleted and completed tasks
    uint32 m_purchaseId;    // Task id for update. I didn't find a way to make this var local
    uint256 m_masterPubKey; // User pubkey
    address m_msigAddress;  // User wallet address

    uint32 INITIAL_BALANCE =  200000000;  // Initial TODO contract balance


    function setShoplistCode(TvmCell code, TvmCell data) public {
        require(msg.pubkey() == tvm.pubkey(), 101);
        tvm.accept();
        m_todoCode = code;
        m_todoData = data;
        m_todoStateInit = tvm.buildStateInit(m_todoCode, m_todoData);
    }


    function onError(uint32 sdkError, uint32 exitCode) public {
        Terminal.print(0, format("Operation failed. sdkError {}, exitCode {}", sdkError, exitCode));
        _menu();
    }

    function onSuccess() public view {
        _getStat(tvm.functionId(setStat));
    }

    function start() public override {
        Terminal.input(tvm.functionId(savePublicKey),"Please enter your public key",false);
    }

    /// @notice Returns Metadata about DeBot.
    function getDebotInfo() public functionID(0xDEB) override view returns(
        string name, string version, string publisher, string key, string author,
        address support, string hello, string language, string dabi, bytes icon
    ) {
        name = "Shoplist DeBot";
        version = "0.1.0";
        publisher = "Alim Sadetov";
        key = "Shoplist manager";
        author = "Alim Sadetov";
        support = address.makeAddrStd(0, 0x66e01d6df5a8d7677d9ab2daf7f258f1e2a7fe73da5320300395f99e01dc3b5f);
        hello = "Hi, i'm a Shoplist DeBot.";
        language = "en";
        dabi = m_debotAbi.get();
        icon = m_icon;
    }

    function getRequiredInterfaces() public view override returns (uint256[] interfaces) {
        return [ Terminal.ID, Menu.ID, AddressInput.ID, ConfirmInput.ID ];
    }

    function savePublicKey(string value) public {
        (uint res, bool status) = stoi("0x"+value);
        if (status) {
            m_masterPubKey = res;

            Terminal.print(0, "Checking if you already have a Shoplist ...");
            //TvmCell deployState = tvm.insertPubkey(m_todoCode, m_masterPubKey);
            TvmCell deployState = tvm.insertPubkey(m_todoStateInit, m_masterPubKey);
            m_address = address.makeAddrStd(0, tvm.hash(deployState));
            Terminal.print(0, format( "Info: your Shoplist contract address is {}", m_address));
            Sdk.getAccountType(tvm.functionId(checkStatus), m_address);

        } else {
            Terminal.input(tvm.functionId(savePublicKey),"Wrong public key. Try again!\nPlease enter your public key",false);
        }
    }


    function checkStatus(int8 acc_type) public {
        if (acc_type == 1) { // acc is active and  contract is already deployed
            _getStat(tvm.functionId(setStat));

        } else if (acc_type == -1)  { // acc is inactive
            Terminal.print(0, "You don't have a Shoplist yet, so a new contract with an initial balance of 0.2 tokens will be deployed");
            AddressInput.get(tvm.functionId(creditAccount),"Select a wallet for payment. We will ask you to sign two transactions");

        } else  if (acc_type == 0) { // acc is uninitialized
            Terminal.print(0, format(
                "Deploying new contract. If an error occurs, check if your Shoplist contract has enough tokens on its balance"
            ));
            deploy();

        } else if (acc_type == 2) {  // acc is frozen
            Terminal.print(0, format("Can not continue: account {} is frozen", m_address));
        }
    }


    function creditAccount(address value) public {
        m_msigAddress = value;
        optional(uint256) pubkey = 0;
        TvmCell empty;
        IMsig(m_msigAddress).sendTransaction{
            abiVer: 2,
            extMsg: true,
            sign: true,
            pubkey: pubkey,
            time: uint64(now),
            expire: 0,
            callbackId: tvm.functionId(waitBeforeDeploy),
            onErrorId: tvm.functionId(onErrorRepeatCredit)  // Just repeat if something went wrong
        }(m_address, INITIAL_BALANCE, false, 3, empty);
    }

    function onErrorRepeatCredit(uint32 sdkError, uint32 exitCode) public {
        // TODO: check errors if needed.
        sdkError;
        exitCode;
        creditAccount(m_msigAddress);
    }


    function waitBeforeDeploy() public  {
        Sdk.getAccountType(tvm.functionId(checkIfStatusIs0), m_address);
    }

    function checkIfStatusIs0(int8 acc_type) public {
        if (acc_type ==  0) {
            deploy();
        } else {
            waitBeforeDeploy();
        }
    }


    function deploy() private view {
            //TvmCell image = tvm.insertPubkey(m_todoCode, m_masterPubKey);
            TvmCell image = tvm.insertPubkey(m_todoStateInit, m_masterPubKey);
            optional(uint256) none;
            TvmCell deployMsg = tvm.buildExtMsg({
                abiVer: 2,
                dest: m_address,
                callbackId: tvm.functionId(onSuccess),
                onErrorId:  tvm.functionId(onErrorRepeatDeploy),    // Just repeat if something went wrong
                time: 0,
                expire: 0,
                sign: true,
                pubkey: none,
                stateInit: image,
                call: {AShoplist, m_masterPubKey}
            });
            tvm.sendrawmsg(deployMsg, 1);
    }


    function onErrorRepeatDeploy(uint32 sdkError, uint32 exitCode) public view {
        // TODO: check errors if needed.
        sdkError;
        exitCode;
        deploy();
    }

    function setStat(Stat stat) public {
        m_stat = stat;
        _menu();
    }

    function _menu() private {
        string sep = '----------------------------------------';
        Menu.select(
            format(
                "You have {}/{}/{} (unbuyed/buyed/total) purchases",
                    m_stat.unbuyedCount,
                    m_stat.buyedCount,
                    m_stat.buyedCount + m_stat.unbuyedCount
            ),
            sep,
            [
                MenuItem("Add new purchase","",tvm.functionId(addPurchase)),
                MenuItem("Show shoplist","",tvm.functionId(showPurchases)),
                MenuItem("Buy purchase from shoplist","",tvm.functionId(buyPurchase)),
                MenuItem("Remove purchase from shoplist","",tvm.functionId(removePurchase))
            ]
        );
    }

    function addPurchase(uint32 index) public {
        index = index;
        Terminal.input(tvm.functionId(addPurchase_), "Write name of purchase, please:", false);
    }

    string public nameOfPurchase;
    function addPurchase_(string name) public {
        nameOfPurchase = name;
        Terminal.input(tvm.functionId(addPurchase__), "Write count of this purchase, please:", false);
    }


    function addPurchase__(string count) public view {
        uint32 purchaseCount;
        optional(uint256) pubkey = 0;
        (uint256 numb,) = stoi(count);
        purchaseCount = uint32(numb);
        IShoplist(m_address).addPurchase{
                abiVer: 2,
                extMsg: true,
                sign: true,
                pubkey: pubkey,
                time: uint64(now),
                expire: 0,
                callbackId: tvm.functionId(onSuccess),
                onErrorId: tvm.functionId(onError)
            }(nameOfPurchase, purchaseCount);
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
                Terminal.print(0, format("{} {}  \"{}\"  at {} for {} dollars", purchase.id, buyed, purchase.name, purchase.createdAt, purchase.cost));
            }
        } else {
            Terminal.print(0, "Your shoplist is empty");
        }
        _menu();
    }

    function buyPurchase(uint32 index) public {
        index = index;
        if (m_stat.buyedCount + m_stat.unbuyedCount > 0) {
            Terminal.input(tvm.functionId(buyPurchase_), "Enter purchase number:", false);
        } else {
            Terminal.print(0, "Sorry, you have no purchases to buy");
            _menu();
        }
    }

    function buyPurchase_(string value) public {
        (uint256 numbe,) = stoi(value);
        m_purchaseId = uint32(numbe);
        Terminal.input(tvm.functionId(buyPurchase__),"What price you paid for this purchase?", false);
    }


    function buyPurchase__(string cost) public view {
        uint32 costOfPurchase;
        optional(uint256) pubkey = 0;
        (uint256 number,) = stoi(cost);
        costOfPurchase = uint32(number);
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


    function removePurchase(uint32 index) public {
        index = index;
        if (m_stat.buyedCount + m_stat.unbuyedCount > 0) {
            Terminal.input(tvm.functionId(removePurchase_), "Enter purchase number:", false);
        } else {
            Terminal.print(0, "Sorry, you have no purchases to remove");
            _menu();
        }
    }

    function removePurchase_(string value) public view {
        (uint256 nu,) = stoi(value);
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
            }(uint32(nu));
    }

    function _getStat(uint32 answerId) private view {
        optional(uint256) none;
        IShoplist(m_address).getStat{
            abiVer: 2,
            extMsg: true,
            sign: false,
            pubkey: none,
            time: uint64(now),
            expire: 0,
            callbackId: answerId,
            onErrorId: 0
        }();
    }

    function onCodeUpgrade() internal override {
        tvm.resetStorage();
    }
}
