class ServerTurn {
    constructor(pPlayer) {
        this.setPlayer(pPlayer);
        this.initialiseTurn();
    }
    setPlayer(pPlayer) {
        this.mPlayer = pPlayer;
    }
    getPlayer() {
        return this.mPlayer;
    }
    setFines(pFines) {
        this.mFines = pFines;
    }
    getFines() {
        return this.mFines;
    }
    initialiseTurn() {
        this.mClaimingPlayers = [];
        this.mFalseClaims = [];
        this.mRightfulClaimants = [];
        this.mLog = [];
        this.setClaimPlayerIndex(0);        
        this.setClaimResolution(null);
        this.setFines(0);
        this.setClaim(null);
                
    }
    fineFalseClaims() {
        let fines = 0;
        for(let i = 0; i < this.numberOfFalselyClaimingPlayers(); i +=1) {
            let falselyClaimingPlayer = this.getFalselyClaimingPlayer(i);            
            console.log("fining " + falselyClaimingPlayer.getName());
            falselyClaimingPlayer.removeCoins(1);
            fines +=1;
            //this.addCourthouseCoins(1);
        }
        this.setFines(fines);
    }
    getJsonObject() {
        let turnObject = {};        
        turnObject.logEntries = this.mLog;
        return turnObject;
    }
    addLogEntry(pLogEntry) {
        this.mLog.push(pLogEntry);
    }
    numberOfLogEntries() {
        return this.mLog.length;
    }
    getLogEntry(pIndex) {
        return this.mLog[pIndex];
    }
    setClaimResolution(pClaimResolution) {
        this.mClaimResolution = pClaimResolution;
    }
    getClaimResolution() {
        return this.mClaimResolution;
    }
    addRightfulClaimant(pClaimant) {
        this.mRightfulClaimants.push(pClaimant);
    }
    getRightfulClaimant(pIndex) {
        return this.mRightfulClaimants[pIndex];
    }
    numberofRightfulClaimants() {
        return this.mRightfulClaimants.length;
    }
    addFalselyClaimingPlayer(pPlayer) {
        this.mFalseClaims.push(pPlayer);
    }
    numberOfFalselyClaimingPlayers() {
        return this.mFalseClaims.length;
    }
    getFalselyClaimingPlayer(pIndex) {
        return this.mFalseClaims[pIndex];
    }
    setClaim(pClaim) {
        this.mClaim = pClaim;
    }
    getClaim() {
        return this.mClaim;
    }
    addClaimingPlayer(pPlayer) {
        this.mClaimingPlayers.push(pPlayer);
    }
    numberOfClaimingPlayers() {
        return this.mClaimingPlayers.length;
    }
    getClaimingPlayer(pIndex) {
        return this.mClaimingPlayers[pIndex];
    }
    setClaimPlayerIndex(pClaimPlayerIndex) {
        this.mClaimPlayerIndex = pClaimPlayerIndex;
    }
    getClaimPlayerIndex() {
        return this.mClaimPlayerIndex;
    }
}
if (typeof exports !== 'undefined') {
    exports.ServerTurn = ServerTurn;
}
else {
    window.ServerTurn = ServerTurn;
}