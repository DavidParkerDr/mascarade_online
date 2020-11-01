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
}
if (typeof exports !== 'undefined') {
    exports.ServerPlayer = ServerPlayer;
}
else {
    window.ServerPlayer = ServerPlayer;
}