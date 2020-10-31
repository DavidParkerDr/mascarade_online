class Player  {
    constructor (pId, pColour, pName, pIsLocal, pIsPlaceHolder) {
        this.setId(pId);
        this.setColour(pColour);
        this.setName(pName);
        this.setIsLocal(pIsLocal);
        this.setIsPlaceHolder(pIsPlaceHolder);
        this.setCoins(6);
        this.setCard(null);
    }
    setIsPlaceHolder(pIsPlaceHolder) {
        this.mIsPlaceHolder = pIsPlaceHolder;
    };
    getIsPlaceHolder() {
        return this.mIsPlaceHolder;
    };
    setId(pId) {
        this.mId = pId;
    };
    getId() {
        return this.mId;
    };
    setCoins(pCoins) {
        this.mCoins = pCoins;
    };
    addCoins(pCoins) {
        this.mCoins += pCoins;
    }
    removeCoins(pCoins) {
        this.mCoins -= pCoins;
        if(this.mCoins < 0) {
            this.mCoins = 0;
        }
    }
    getCoins() {
        return this.mCoins;
    };
    setColour(pColour) {
        this.mColour = pColour;
    };
    getColour() {
        return this.mColour;
    };
    setName(pName) {
        this.mName = pName;
    };
    getName() {
        return this.mName;
    };
    setIsLocal(pIsLocal) {
        this.mIsLocal = pIsLocal;
    };
    getIsLocal() {
        return this.mIsLocal;
    };
    setCard(pCard) {
        this.mCard = pCard;
    };
    getCard() {
        return this.mCard;
    };
    hideCard() {
        if(this.mCard != null) {
            this.mCard.hide();
        }
    }
    showCard() {
        if(this.mCard != null) {
            this.mCard.show();
        }
    }
    toJSON() {
        let jsonString;
        jsonString = '{"playerId": "' + this.getId() + '", "name": "' + this.getName() + '"}';
        return jsonString;
    };
}
if (typeof exports !== 'undefined') {
    exports.Player = Player;
}
else {
    window.Player = Player;
}