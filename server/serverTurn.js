class ServerTurn {
    constructor(pPlayer) {
        this.setPlayer(pPlayer);
    }
    setPlayer(pPlayer) {
        this.mPlayer = pPlayer;
    }
    getPlayer() {
        return this.mPlayer;
    }
}
if (typeof exports !== 'undefined') {
    exports.ServerTurn = ServerTurn;
}
else {
    window.ServerTurn = ServerTurn;
}