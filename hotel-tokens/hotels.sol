pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;


contract hotels {

    struct Hotel {
        string name;
        uint rooms;
        uint8 stars;
        bool isForSale;
    }

    Hotel[] HotelsArray;

    mapping (uint => uint) public HotelToOwner;

    modifier Accept() {
		tvm.accept();
        _;
    }

    function createToken (string _name, uint _rooms, uint8 _stars) public Accept{
        require (_stars>=0 && _stars<=5, 5, 'у отелей не может быть такого количества звёзд');

        for (uint i=0;i<HotelsArray.length;i++){
            require (HotelsArray[i].name!=_name, 6, 'имя добавляемого отеля уже существует в списке отелей');
        }


        HotelsArray.push(Hotel(_name,_rooms, _stars, false));
        uint lastTokenId = HotelsArray.length -1;
        HotelToOwner[lastTokenId]=msg.pubkey();
    }


    function putHotelOnSale(uint tokenId) public Accept{
        require (msg.pubkey() == HotelToOwner[tokenId], 7, 'вы не являетесь владельцем отеля');
        HotelsArray[tokenId].isForSale = true;

    }


}
