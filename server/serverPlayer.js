class ServerPlayer extends Player {
    constructor (pId, pColour, pName, pIsLocal, pIsPlaceHolder, pClient) {
        super(pId, pColour, pName, pIsLocal, pIsPlaceHolder);
        this.setClient(pClient);
    }

    
    setClient(pClient) {
        this.mClient = pClient;
    }
    getClient() {
        return this.mClient;
    }
    getIsLocal() {
        if(this.getClient() == null) {
            return false;
        }
        return this.getClient().id == this.getId();
    }
    getJsonObject(pIncludeCard = false) {
        let personObject = {};
        personObject.name = this.getName();
        personObject.isReady = this.getIsReady();
        personObject.coins = this.getCoins();
        personObject.isPlaceHolder = this.getIsPlaceHolder();
        if(pIncludeCard) {
            let card = this.getCard();
            if(card != null) {
                personObject.card = this.getCard().getName();
            }
        }
        return personObject;
    }
}
if (typeof exports !== 'undefined') {
    exports.ServerPlayer = ServerPlayer;
}
else {
    window.ServerPlayer = ServerPlayer;
}