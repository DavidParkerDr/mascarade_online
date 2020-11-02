const { ServerTurn } = require("./serverTurn");

class ServerGame {
    constructor() {
        this.mPlayers = [];
        this.setIsGameStarted(false);
        this.setShouldShowCards(false);
        this.setShouldShowResolution(false);
        this.setShouldShowGameOver(false);
        this.setCurrentPlayerIndex(0);
        this.mTurns = [];
        this.setCourthouseCoins(0);        
        this.resetClaims();
    }
    setMandatorySwaps(pMandatorySwaps) {
        this.mMandatorySwaps = pMandatorySwaps;
    }
    getMandatorySwaps() {
        return this.mMandatorySwaps;
    }
    decrementMandatorySwaps() {
        let mandatorySwaps = this.getMandatorySwaps() - 1;
        if (mandatorySwaps < 0) {
            mandatorySwaps = 0;
        }
        this.setMandatorySwaps(mandatorySwaps);
    }
    pickRandomPlayerIndex() {
        var index = Math.floor((Math.random() * this.numberOfNonPlaceHolderPlayers()) + 0);
        return index;
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
    setCourthouseCoins(pCourthouseCoins) {
        this.mCourthouseCoins = pCourthouseCoins;
    }
    getCourthouseCoins() {
        return this.mCourthouseCoins;
    }
    addCourthouseCoins(pCourthouseCoins) {
        this.mCourthouseCoins += pCourthouseCoins;
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
    addTurn(pTurn) {
        this.mTurns.push(pTurn);
    }
    getLatestTurn() {
        if(this.numberOfTurns() > 0) {
            return this.mTurns[this.numberOfTurns() -1];
        }
        return null;
    }
    numberOfTurns() {
        return this.mTurns.length;
    }

    setCurrentPlayerIndex(pCurrentPlayerIndex) {
        this.mCurrentPlayerIndex = pCurrentPlayerIndex;
    }
    getCurrentPlayerIndex() {
        return this.mCurrentPlayerIndex;
    }
    getNextPlayerIndex() {
        let index = this.mCurrentPlayerIndex;
        do {
            index += 1;
            if(index >= this.numberOfPlayers()) {
                index = 0;
            }
        }
        while(this.getPlayer(index).getIsPlaceHolder())
        return index;
    }
    incrementCurrentPlayerIndex() {
        this.mCurrentPlayerIndex =this.getNextPlayerIndex();
    }
    setClaimPlayerIndex(pClaimPlayerIndex) {
        this.mClaimPlayerIndex = pClaimPlayerIndex;
    }
    getClaimPlayerIndex() {
        return this.mClaimPlayerIndex;
    }
    incrementCurrentPlayerIndex() {
        this.mCurrentPlayerIndex += 1;
        if(this.mCurrentPlayerIndex >= this.numberOfPlayers()) {
            this.mCurrentPlayerIndex = 0;
        }
    }
    setShouldShowCards(pShouldShowCards) {
        this.mShouldShowCards = pShouldShowCards;
    }
    getShouldShowCards() {
        return this.mShouldShowCards;
    }
    setShouldShowResolution(pShouldShowResolution) {
        this.mShouldShowResolution = pShouldShowResolution;
    }
    getShouldShowResolution() {
        return this.mShouldShowResolution;
    }
    setShouldShowGameOver(pShouldShowGameOver) {
        this.mShouldShowGameOver = pShouldShowGameOver;
    }
    getShouldShowGameOver() {
        return this.mShouldShowGameOver;
    }
    setIsGameStarted(pIsGameStarted) {
        this.mIsGameStarted = pIsGameStarted;
    }
    getIsGameStarted() {
        return this.mIsGameStarted;
    }
    numberOfPlayers() {
        return this.mPlayers.length;
    };
    numberOfNonPlaceHolderPlayers() {
        let count = 0;
        for(let i = 0; i < this.numberOfPlayers(); i+=1) {
            let player = this.getPlayer(i);
            if(!player.getIsPlaceHolder()){
                count +=1;
            }
        }
        return count;
    };
    getPlayer(pIndex) {
        if(pIndex < this.numberOfPlayers()) {
            return this.mPlayers[pIndex];
        }
        return null;
    };
    getPlayerIndex(pId) {
        var i;
        for (i = 0; i < this.numberOfPlayers(); i++) {
            let player = this.mPlayers[i];
            if (player.getId() == pId) {
                return i;
            }
        };
        return -1;
    };
    getPlayerById(pId) {
        var i;
        for (i = 0; i < this.numberOfPlayers(); i++) {
            let player = this.mPlayers[i];
            if (player.getId() == pId) {
                return player;
            }
        };
        return null;
    };
    addPlayer(pPlayer) {
        this.mPlayers.push(pPlayer);
    };
    removePlayerAtIndex(pIndex) {
        this.mPlayers.splice(pIndex, 1);
    };
    removePlayer(pPlayer) {
        let index = this.mPlayers.indexOf(pPlayer);
        this.removePlayerAtIndex(index);
    };
    onSocketConnection(client) {
        console.log("New player has connected: "+ client.id);
        // Listen for client disconnected
        client.on("disconnect", this.onClientDisconnect.bind(this, client));

        // Listen for new player message
        client.on("new player", this.onNewPlayer.bind(this, client));

        // Listen for name update message
        client.on("name update", this.onNameUpdate.bind(this, client));

        client.on("start game", this.onStartGame.bind(this, client));
        client.on("hide cards", this.onHideCards.bind(this, client));
        client.on("show cards", this.onShowCards.bind(this, client));

        client.on("player ready", this.onPlayerReady.bind(this, client));
        client.on("player not ready", this.onPlayerNotReady.bind(this, client));

        client.on("turn choice made", this.turnChoice.bind(this, client));
        client.on("end turn", this.endTurn.bind(this, client));
        client.on("bishop victim chosen", this.bishopVictimChosen.bind(this, client));
        client.on("witch victim chosen", this.witchVictimChosen.bind(this, client));
        client.on("fool swap chosen", this.foolSwapChosen.bind(this, client));
        client.on("fool not chosen", this.foolNotChosen.bind(this, client));
        client.on("spy victim chosen", this.spyVictimChosen.bind(this, client));
        client.on("spy swap chosen", this.spySwapChosen.bind(this, client));
        client.on("spy not chosen", this.spyNotChosen.bind(this, client));
        client.on("inquisitor victim chosen", this.inquisitorVictimChosen.bind(this, client));
        client.on("inquisitor made a guess", this.inquisitorVictimGuessed.bind(this, client));

        client.on("player resolution ready", this.onPlayerResolutionReady.bind(this, client));
        client.on("player resolution not ready", this.onPlayerResolutionNotReady.bind(this, client));

        client.on("player game over ready", this.onPlayerGameOverReady.bind(this, client));
        client.on("player game over not ready", this.onPlayerGameOverNotReady.bind(this, client));

    };

    onPlayerReady(pClient, pData) {
        let player = this.getPlayerById(pClient.id);
        if (player != null) {
            player.setIsReady(true);
        }
        this.updateClientPlayers();
        if(this.areAllPlayersReady()) {
            if(this.getIsGameStarted()) {
                this.setShouldShowCards(false);
                this.updateClientPlayers();
                this.startGameLoop();
            }
            else {
                this.startGame();
            }
        }
    }
    startGameLoop() {
        this.nextTurn();
    }

    nextTurn() {
        let currentPlayer = this.getPlayer(this.getCurrentPlayerIndex());
        while(currentPlayer.getIsPlaceHolder()) {
            this.incrementCurrentPlayerIndex();
            currentPlayer = this.getPlayer(this.getCurrentPlayerIndex());
        }
        let turn = new ServerTurn(currentPlayer);
        this.addTurn(turn);
        this.sendTurnOptions(turn);
    }

    sendTurnOptions(pTurn) {
        let dataObject = {};
        dataObject.turnOptions = [];
        if(this.getMandatorySwaps() == 0) {
            let lookTurnOption = {};
            lookTurnOption.id = "lookAtCard";
            lookTurnOption.text = "Look At Card";
            dataObject.turnOptions.push(lookTurnOption);
        }
        let swapTurnOption = {};
        swapTurnOption.id = "swapOrNot";
        swapTurnOption.text = "Swap Or Not";
        dataObject.turnOptions.push(swapTurnOption);
        if(this.getMandatorySwaps() == 0) {
            let claimTurnOption = {};
            claimTurnOption.id = "makeAClaim";
            claimTurnOption.text = "Make a Claim";
            dataObject.turnOptions.push(claimTurnOption);   
        }
        this.decrementMandatorySwaps();     
        pTurn.getPlayer().getClient().emit("your turn", dataObject);
        let otherDataObject = {};
        otherDataObject.playerName = pTurn.getPlayer().getName();
        otherDataObject.message = "They are deciding what to do.";
        let total = this.numberOfPlayers();
        for(let i = 0; i < total; i +=1) {
            let player = this.getPlayer(i);
            if (player.getId() != pTurn.getPlayer().getId()) {
                if(!player.getIsPlaceHolder()) {
                    player.getClient().emit("other turn", otherDataObject);
                }
            }
        }
    }

    turnChoice(pClient, pData) {
        let turn = this.getLatestTurn();
        let player = turn.getPlayer();
        if(pClient.id == player.getId()) {
            if(pData.choice == "lookAtCard") {
                this.lookAtCard(turn);
            }
            else if(pData.choice == "swapOrNot") {
                this.swapOrNot(turn);
            }
            else if(pData.choice == "swapOrNotPlayerChosen") {
                this.swapOrNotPlayerChosen(turn, pData.playerid);
            }
            else if(pData.choice == "swapWithPlayerChosen") {
                this.swapWithPlayerChosen(turn, pData.playerid);
            }
            else if(pData.choice == "notWithPlayerChosen") {
                this.notWithPlayerChosen(turn, pData.playerid);
            }
            else if(pData.choice == "makeAClaim") {
                this.makeAClaim(turn);
            }
            else if(pData.choice == "madeAClaim") {
                this.madeAClaim(turn, pData.claimOption);
            }
        }
        else {
            if(pData.choice == "madeACounterClaim") {
                this.madeACounterClaim(turn, pClient.id);
            }
            else if(pData.choice == "keptQuiet") {
                this.keptQuiet(turn, pClient.id);
            }
        }
    }

    madeACounterClaim(pTurn, pPlayerId) {
        let player = this.getPlayerById(pPlayerId);
        console.log(pPlayerId + " made counter claim. " + player.getName());
        this.addClaimingPlayer(player);
        this.subsequentClaim(pTurn);
    }
    keptQuiet(pTurn, pPlayerId) {
        let player = this.getPlayerById(pPlayerId);
        console.log(pPlayerId + " kept quiet. " + player.getName());
        this.subsequentClaim(pTurn);
    }
    madeAClaim(pTurn, pClaimOption) {
        this.setClaimPlayerIndex(this.getCurrentPlayerIndex());
        this.addClaimingPlayer(pTurn.getPlayer());
        this.setClaim(pClaimOption);
        this.subsequentClaim(pTurn);
    }
    subsequentClaim(pTurn)
    {
        let player = pTurn.getPlayer();
        this.incrementCurrentPlayerIndex();
        let nextClaimant = this.getPlayer(this.getCurrentPlayerIndex());
        while(nextClaimant.getIsPlaceHolder()) {
            this.incrementCurrentPlayerIndex();
            nextClaimant = this.getPlayer(this.getCurrentPlayerIndex());
        }
        if(this.getCurrentPlayerIndex() != this.getClaimPlayerIndex()) {
            
            let dataObject = {};
            dataObject.player = nextClaimant.getName();
            dataObject.claimOption = this.getClaim();
            dataObject.claims = [];
            for (let i = 0; i < this.numberOfClaimingPlayers(); i +=1) {
                let claimingPlayer = this.getClaimingPlayer(i);
                dataObject.claims.push(claimingPlayer.getName());
            }
            nextClaimant.getClient().emit("respond to claim", dataObject);
            let total = this.numberOfPlayers();
            for(let i = 0; i < total; i +=1) {
                let player = this.getPlayer(i);
                if (player.getId() != nextClaimant.getId()) {
                    if(!player.getIsPlaceHolder()) {
                        player.getClient().emit("hearing claims", dataObject);
                    }
                }
            }
        }
        else {
            // everyone has had a chance to respond
            console.log("everyone has responded to the claim");
            if(this.numberOfClaimingPlayers() > 1) {
                // resolve competing claims
                console.log("there were multiple claims");
                this.resolveClaims();
            }
            else {
                // uncontested
                console.log("the claim was uncontested");
                this.addRightfulClaimant(this.getClaimingPlayer(0));
            }
            if(this.numberofRightfulClaimants() > 0) {
                this.enactClaim();
            }
            else {
                // no successful claims
                console.log("everyone was wrong");
                let claimResolution = "Everyone was wrong.";
                this.setClaimResolution(claimResolution);
                this.finaliseClaims();                  
            }
        }
    }
    checkMandatorySwaps() {
        let mandatorySwapsNeeded = false;
        for(let i = 0; i < this.numberofRightfulClaimants(); i+=1) {
            let rightfulClaimant = this.getRightfulClaimant(i);
            let rightfulClaimantIndex = this.getPlayerIndex(rightfulClaimant.getId());
            let nextPlayerIndex = this.getNextPlayerIndex();
            if(rightfulClaimantIndex == nextPlayerIndex) {
                mandatorySwapsNeeded = true;
                break;
            }
        }
        if(mandatorySwapsNeeded) {
            this.setMandatorySwaps(1);
        }
    }
    enactClaim() {
        let claim = this.getClaim();
        if(claim == "Judge") {
            // take the coins from the courthouse
            let rightfulClaimant = this.getRightfulClaimant(0);
            rightfulClaimant.addCoins(this.getCourthouseCoins());
            let claimResolution = rightfulClaimant.getName() + " is the Judge and took " + this.getCourthouseCoins() +  " coins from the Courthouse.";
            this.setClaimResolution(claimResolution);
            this.setCourthouseCoins(0);      
            this.finaliseClaims();                  
        }
        else if(claim == "Bishop") {
            // takes 2 coins from the richest player
            let rightfulClaimant = this.getRightfulClaimant(0);
            let biggestFortune = 0;
            let richestPlayers = [];
            for(let i = 0; i < this.numberOfPlayers(); i+= 1) {
                let player = this.getPlayer(i);
                if(player.getId() != rightfulClaimant.getId() && !player.getIsPlaceHolder()) {
                    if(player.getCoins() > biggestFortune) {                    
                        biggestFortune = player.getCoins();
                        richestPlayers = [];
                        richestPlayers.push(player);
                    }
                    else {
                        richestPlayers.push(player);
                    }
                }
            }
            if(richestPlayers.length == 1) {
                let richestPlayer = richestPlayers[0];
                let tempCoins = richestPlayer.getCoins();
                richestPlayer.removeCoins(2);
                if(tempCoins > 2) {
                    tempCoins = 2;
                }
                rightfulClaimant.addCoins(tempCoins);
                let claimResolution = rightfulClaimant.getName() + " is the Bishop and took " + tempCoins +  " coins from " + richestPlayer.getName();
                this.setClaimResolution(claimResolution);
                this.finaliseClaims();
            }
            else {
                // Bishop needs to choose victim
                this.chooseBishopVictim(rightfulClaimant, richestPlayers);
            }
            
        }
        else if(claim == "King") {
            // take 3 coins
            let rightfulClaimant = this.getRightfulClaimant(0);
            rightfulClaimant.addCoins(3);
            let claimResolution = rightfulClaimant.getName() + " is the King and took " + 3 +  " coins from the Bank.";
            this.setClaimResolution(claimResolution);
            this.finaliseClaims();
        }
        else if(claim == "Fool") {
            // take 1 coin and swap or not two other players cards
            let rightfulClaimant = this.getRightfulClaimant(0);
            rightfulClaimant.addCoins(1);
            // choose 2 people to swap or not
            this.chooseFoolVictims(rightfulClaimant);
        }
        else if(claim == "Queen") {
            // take 2 coins
            let rightfulClaimant = this.getRightfulClaimant(0);
            rightfulClaimant.addCoins(2);
            let claimResolution = rightfulClaimant.getName() + "is the Queen and took " + 2 +  " coins from the Bank.";
            this.setClaimResolution(claimResolution);
            this.finaliseClaims();
        }
        else if(claim == "Thief") {
            // takes a coin from the adjacent players
            let rightfulClaimant = this.getRightfulClaimant(0);
            let rightfulClaimantIndex = this.getPlayerIndex(rightfulClaimant.getId());
            let leftVictimIndex = rightfulClaimantIndex - 1;
            if(leftVictimIndex < 0) {
                leftVictimIndex = this.numberOfPlayers() -1;
            }
            let leftVictim = this.getPlayer(leftVictimIndex);
            while(leftVictim.getIsPlaceHolder()) {
                leftVictimIndex = leftVictimIndex - 1;
                if(leftVictimIndex < 0) {
                    leftVictimIndex = this.numberOfPlayers() -1;
                }
                leftVictim = this.getPlayer(leftVictimIndex);
            }
            let tempCoins1 = leftVictim.getCoins();
            leftVictim.removeCoins(1);
            if(tempCoins1 > 1) {
                tempCoins1 = 1;
            }
            rightfulClaimant.addCoins(tempCoins1);
            let rightVictimIndex = rightfulClaimantIndex + 1;
            if(rightVictimIndex >= this.numberOfPlayers()) {
                rightVictimIndex = 0;
            }
            let rightVictim = this.getPlayer(rightVictimIndex);
            while(rightVictim.getIsPlaceHolder()){
                rightVictimIndex = rightVictimIndex + 1;
                if(rightVictimIndex >= this.numberOfPlayers()) {
                    rightVictimIndex = 0;
                }
                rightVictim = this.getPlayer(rightVictimIndex);
            }
            let tempCoins2 = rightVictim.getCoins();
            rightVictim.removeCoins(1);
            if(tempCoins2 > 1) {
                tempCoins2 = 1;
            }
            rightfulClaimant.addCoins(tempCoins2);
            let claimResolution = rightfulClaimant.getName() + " is the Thief and took " + tempCoins1 +  " coins from " + leftVictim.getName() + " and " + tempCoins2 + " coins from " + rightVictim.getName();
            this.setClaimResolution(claimResolution);
            this.finaliseClaims();
        }
        else if(claim == "Witch") {
            // swap coins with another player
            this.chooseWitchVictim(rightfulClaimant);
        }
        else if(claim == "Spy") {
            // looks at their card and another players card and then swaps or not
            this.chooseSpyVictim(rightfulClaimant);
        }
        else if(claim == "Peasant") {
            // take 1 coin unless both peasants have rightfully claimed
            let coins = 1;
            let claimResolution = "";
            
            if(this.numberofRightfulClaimants() > 1) {
                coins = 2;
            }
            for(let i = 0; i < this.numberofRightfulClaimants(); i +=1) {
                let rightfulClaimant = this.getRightfulClaimant(i);
                rightfulClaimant.addCoins(coins);
                if(i != 0) {
                    claimResolution += " and ";
                }
                claimResolution += rightfulClaimant.getName();
            }
            if(this.numberofRightfulClaimants() > 1) {
                claimResolution += " are Peasants";
            }
            else {
                claimResolution += " is a Peasant";
            }
            claimResolution += " and have taken " + coins + " coins from the Bank.";
            this.setClaimResolution(claimResolution);
            this.finaliseClaims();
        }
        else if(claim == "Cheat") {
            // can win with only 10 coins
            let rightfulClaimant = this.getRightfulClaimant(0);
            if(rightfulClaimant.getCoins() >= 10) {
                // cheat wins
                let claimResolution = rightfulClaimant.getName() + " is the Cheat and has won.";
                this.setClaimResolution(claimResolution);
            }
            else {
                let claimResolution = rightfulClaimant.getName() + " is the Cheat but is too poor to win.";
                this.setClaimResolution(claimResolution);
            }
            this.finaliseClaims();
        }
        else if(claim == "Inquisitor") {
            // chooses another player to guess their own card, if they are wrong they pay the Inquisitor 4 coins
            this.chooseInquisitorVictim(rightfulClaimant);
        }
        else if(claim == "Widow") {
            // fortune topped up to 10 coins
            let rightfulClaimant = this.getRightfulClaimant(0);
            if(rightfulClaimant.getCoins() < 10) {
                rightfulClaimant.setCoins(10);
                let claimResolution = rightfulClaimant.getName() + " is the Widow and has topped up her fortune to 10 coins.";
                this.setClaimResolution(claimResolution);
            }
            else {
                let claimResolution = rightfulClaimant.getName() + " is the Widow but they already had 10 coins.";
                this.setClaimResolution(claimResolution);
            }
            this.finaliseClaims();
        }
    }
    finaliseClaims() {
        console.log("finaliseClaims " + this.getClaimResolution());
        this.fineFalseClaims();
        this.checkMandatorySwaps();
        this.setAllPlayersNotReady();
        this.setShouldShowResolution(true);
        this.updateClientPlayers();
        let dataObject = {};
        dataObject.claimsResolution = this.getClaimResolution();
        dataObject.claim = this.getClaim();      
        dataObject.falseClaims = [];
        for(let i = 0; i < this.numberOfFalselyClaimingPlayers(); i +=1) {
            let claimObject = {};
            let falselyClaimingPlayer = this.getFalselyClaimingPlayer(i);  
            claimObject.player = falselyClaimingPlayer.getName();
            claimObject.card = falselyClaimingPlayer.getCard().getName();
            dataObject.falseClaims.push(claimObject);
        }
        let total = this.numberOfPlayers();
        for(let i = 0; i < total; i +=1) {
            let player = this.getPlayer(i);
            if(!player.getIsPlaceHolder()) {
                player.getClient().emit("claims resolution", dataObject);
            }
            
        }
        

    }
    resolveClaims() {
        for(let i = 0; i < this.numberOfClaimingPlayers(); i +=1) {
            let claimingPlayer = this.getClaimingPlayer(i);
            let card = claimingPlayer.getCard();
            if(card.getName() != this.getClaim()) {
                // false claim
                this.addFalselyClaimingPlayer(claimingPlayer);
            }
            else {
                // rightful claim
                this.addRightfulClaimant(claimingPlayer);
            }
        }
        
        
    }
    fineFalseClaims() {
        for(let i = 0; i < this.numberOfFalselyClaimingPlayers(); i +=1) {
            let falselyClaimingPlayer = this.getFalselyClaimingPlayer(i);            
            console.log("fining " + falselyClaimingPlayer.getName());
            falselyClaimingPlayer.removeCoins(1);
            this.addCourthouseCoins(1);
        }
    }
    resetClaims() {
        this.setClaimPlayerIndex(0);
        this.mClaimingPlayers = [];
        this.mFalseClaims = [];
        this.mRightfulClaimants = [];
        this.setClaimResolution(null);
    }

    makeAClaim(pTurn) {
        let player = pTurn.getPlayer();
        let dataObject = {};
        let deck = Deck.createDeck(this.numberOfNonPlaceHolderPlayers());
        dataObject.claimOptions = [];
        for (let i = 0; i < deck.numberOfCards(); i++) {
            let card = deck.getCard(i);
            dataObject.claimOptions.push(card.getName());         
        }
        player.getClient().emit("make a claim", dataObject);
        let otherDataObject = {};
        otherDataObject.playerName = pTurn.getPlayer().getName();
        otherDataObject.message = "They are preparing an announcement!";
        let total = this.numberOfPlayers();
        for(let i = 0; i < total; i +=1) {
            let player = this.getPlayer(i);
            if (player.getId() != pTurn.getPlayer().getId()) {
                if(!player.getIsPlaceHolder()) {
                    player.getClient().emit("other turn", otherDataObject);
                }
            }
        }
    }

    lookAtCard(pTurn) {
        let player = pTurn.getPlayer();
        player.getClient().emit("look at card", {card: player.getCard().getName()});
        let otherDataObject = {};
        otherDataObject.playerName = pTurn.getPlayer().getName();
        otherDataObject.message = "They are looking at their card.";
        let total = this.numberOfPlayers();
        for(let i = 0; i < total; i +=1) {
            let player = this.getPlayer(i);
            if (player.getId() != pTurn.getPlayer().getId()) {
                if(!player.getIsPlaceHolder()) {
                    player.getClient().emit("other turn", otherDataObject);
                }
            }
        }
    }

    chooseBishopVictim(pClaimant, pRichestPlayers) {
        let claimant = pClaimant;
        let dataObject = {};
        dataObject.victims = [];
        for(let i = 0; i < pRichestPlayers.length; i +=1) {
            let richestPlayer = pRichestPlayers[i];
            let victimObject = {id: richestPlayer.getId(), name: richestPlayer.getName()};
            dataObject.victims.push(victimObject);
        }
        
        claimant.getClient().emit("choose bishop victim", dataObject);
        let otherDataObject = {};
        otherDataObject.playerName = claimant.getName();
        otherDataObject.message = "They are the Bishop, choosing their victim.";
        let total = this.numberOfPlayers();
        for(let i = 0; i < total; i +=1) {
            let player = this.getPlayer(i);
            if (player.getId() != claimant.getId()) {
                if(!player.getIsPlaceHolder()) {
                    player.getClient().emit("other turn", otherDataObject);
                }
            }
        }
    }
    bishopVictimChosen(pClient, pData) {
        let claimant = this.getPlayerById(pClient.id);
        let victim = this.getPlayerById(pData.id);
        
        let tempCoins = victim.getCoins();
        victim.removeCoins(2);
        if(tempCoins > 2) {
            tempCoins = 2;
        }
        claimant.addCoins(tempCoins);
        let claimResolution = claimant.getName() + " is the Bishop and took " + tempCoins +  " coins from " + victim.getName();
        this.setClaimResolution(claimResolution);
        this.finaliseClaims();
    }
    chooseWitchVictim(pClaimant) {
        let claimant = pClaimant;
        let dataObject = {};
        dataObject.victims = [];
        for (let i = 0; i < this.numberOfPlayers(); i++) {
            let existingPlayer = this.getPlayer(i);
            if(claimant.getId() != existingPlayer.getId()) {                    
                let playerObject = {};
                playerObject.id = existingPlayer.getId();
                playerObject.name = existingPlayer.getName();
                dataObject.victims.push(playerObject);
            }            
        }
        player.getClient().emit("choose witch victim", dataObject);
        let otherDataObject = {};
        otherDataObject.playerName = pTurn.getPlayer().getName();
        otherDataObject.message = "They are the Witch, choosing their victim.";
        let total = this.numberOfPlayers();
        for(let i = 0; i < total; i +=1) {
            let player = this.getPlayer(i);
            if (player.getId() != claimant.getId()) {
                if(!player.getIsPlaceHolder()) {
                    player.getClient().emit("other turn", otherDataObject);
                }
            }
        }
    }
    witchVictimChosen(pClient, pData) {
        let claimant = this.getPlayerById(pClient.id);
        let victim = this.getPlayerById(pData.id);
        let tempCoins = claimant.getCoins();
        claimant.addCoins(victim.getCoins());
        victim.setCoins(tempCoins);  
        let claimResolution = claimant.getName() + " is the Witch and swapped fortune with " + victim.getName();
        this.setClaimResolution(claimResolution);  
        this.finaliseClaims();    
    }
    chooseFoolVictims(pClaimant) {
        let claimant = pClaimant;
        let dataObject = {};
        dataObject.victims = [];
        for (let i = 0; i < this.numberOfPlayers(); i++) {
            let existingPlayer = this.getPlayer(i);
            if(claimant.getId() != existingPlayer.getId()) {                    
                let playerObject = {};
                playerObject.id = existingPlayer.getId();
                playerObject.name = existingPlayer.getName();
                dataObject.victims.push(playerObject);
            }            
        }
        player.getClient().emit("choose fool victims", dataObject);
        let otherDataObject = {};
        otherDataObject.playerName = pTurn.getPlayer().getName();
        otherDataObject.message = "They are the Fool, choosing their victims.";
        let total = this.numberOfPlayers();
        for(let i = 0; i < total; i +=1) {
            let player = this.getPlayer(i);
            if (player.getId() != claimant.getId()) {
                if(!player.getIsPlaceHolder()) {
                    player.getClient().emit("other turn", otherDataObject);
                }
            }
        }
    }
    foolVictimsChosen(pClient, pData) {
        let claimant = this.getPlayerById(pClient.id);
        let victim1 = this.getPlayerById(pData.id1);
        let victim2 = this.getPlayerById(pData.id2);
        // need to swap or not
        let dataObject = {};
        dataObject.playerid = claimant.getId();
        dataObject.victim1Name = victim1.getName();
        dataObject.victim1Id = victim1.getId();
        dataObject.victim2Name = victim2.getName();
        dataObject.victim2Id = victim2.getId();
        player.getClient().emit("fool swap or not result", dataObject);
        let otherDataObject = {};
        otherDataObject.playerName = pTurn.getPlayer().getName();
        otherDataObject.message = claimant.getName() = ' is the Fool. They are swapping ' + victim1.getName() + ' with ' + victim2.getName() + '; or are they?';
        let total = this.numberOfPlayers();
        for(let i = 0; i < total; i +=1) {
            let player = this.getPlayer(i);
            if (player.getId() != claimant.getId()) {
                if(!player.getIsPlaceHolder()) {
                    player.getClient().emit("other turn", otherDataObject);
                }
            }
        }
    }
    foolSwapChosen(pClient, pData){
        let claimant = this.getPlayerById(pClient.id);
        let victim1 = this.getPlayerById(pData.victim1);
        let victim2 = this.getPlayerById(pData.victim2);

        let tempCard = victim1.getCard();

        victim1.setCard(victim2.getCard());
        victim2.setCard(tempCard);

        // fool swapped victims cards
        let claimResolution = claimant.getName() + " is the Fool and swapped " + victim1.getName() + " and " + victim2.getName() + "; or did they?";
        this.setClaimResolution(claimResolution);
        this.finaliseClaims();
    }
    foolNotChosen(pClient, pData){
        let claimant = this.getPlayerById(pClient.id);
        let victim1 = this.getPlayerById(pData.victim1);
        let victim2 = this.getPlayerById(pData.victim2);
        // fool didn't swap victims cards
        let claimResolution = claimant.getName() + " is the Fool and swapped " + victim1.getName() + " and " + victim2.getName() + "; or did they?";
        this.setClaimResolution(claimResolution);
        this.finaliseClaims();
    }
    chooseSpyVictim(pClaimant) {
        let claimant = pClaimant;
        let dataObject = {};
        dataObject.victims = [];
        for (let i = 0; i < this.numberOfPlayers(); i++) {
            let existingPlayer = this.getPlayer(i);
            if(claimant.getId() != existingPlayer.getId()) {                    
                let playerObject = {};
                playerObject.id = existingPlayer.getId();
                playerObject.name = existingPlayer.getName();
                dataObject.victims.push(playerObject);
            }            
        }
        player.getClient().emit("choose spy victim", dataObject);
        let otherDataObject = {};
        otherDataObject.playerName = pTurn.getPlayer().getName();
        otherDataObject.message = "They are the Spy, choosing their victim.";
        let total = this.numberOfPlayers();
        for(let i = 0; i < total; i +=1) {
            let player = this.getPlayer(i);
            if (player.getId() != claimant.getId()) {
                if(!player.getIsPlaceHolder()) {
                    player.getClient().emit("other turn", otherDataObject);
                }
            }
        }
    }
    spyVictimChosen(pClient, pData) {
        let claimant = this.getPlayerById(pClient.id);
        let victim = this.getPlayerById(pData.id);

        // need to swap or not
        let dataObject = {};
        dataObject.playerid = claimant.getId();
        dataObject.victimId = victim.getId();
        dataObject.victimName = victim.getName();
        player.getClient().emit("spy swap or not result", dataObject);
        let otherDataObject = {};
        otherDataObject.playerName = pTurn.getPlayer().getName();
        otherDataObject.message = claimant.getName() = ' is the Spy. They are swapping with ' + victim.getName() + '; or are they?';
        let total = this.numberOfPlayers();
        for(let i = 0; i < total; i +=1) {
            let player = this.getPlayer(i);
            if (player.getId() != claimant.getId()) {
                if(!player.getIsPlaceHolder()) {
                    player.getClient().emit("other turn", otherDataObject);
                }
            }
        }
                
    }
    spySwapChosen(pClient, pData){
        let victim = this.getPlayerById(pData.victim);
        let claimant = this.getPlayerById(pClient.id);

        let tempCard = claimant.getCard();

        claimant.setCard(victim.getCard());
        victim.setCard(tempCard);

        // spy swapped victims cards
        let claimResolution = claimant.getName() + " is the Spy and swapped with" + victim.getName() + "; or did they?";
        this.setClaimResolution(claimResolution);
        this.finaliseClaims();
    }
    spyNotChosen(pClient, pData){
        let victim = this.getPlayerById(pData.victim);
        let claimant = this.getPlayerById(pClient.id);
        // spy didn't swap victims cards
        let claimResolution = claimant.getName() + " is the Spy and swapped with" + victim.getName() + "; or did they?";
        this.setClaimResolution(claimResolution);
        this.finaliseClaims();
    }
    chooseInquisitorVictim(pClaimant) {
        let claimant = pClaimant;
        let dataObject = {};
        dataObject.victims = [];
        for (let i = 0; i < this.numberOfPlayers(); i++) {
            let existingPlayer = this.getPlayer(i);
            if(claimant.getId() != existingPlayer.getId()) {                    
                let playerObject = {};
                playerObject.id = existingPlayer.getId();
                playerObject.name = existingPlayer.getName();
                dataObject.victims.push(playerObject);
            }            
        }
        player.getClient().emit("choose inquisitor victim", dataObject);
        let otherDataObject = {};
        otherDataObject.playerName = pTurn.getPlayer().getName();
        otherDataObject.message = "They are the Inquisitor, choosing their victim.";
        let total = this.numberOfPlayers();
        for(let i = 0; i < total; i +=1) {
            let player = this.getPlayer(i);
            if (player.getId() != claimant.getId()) {
                if(!player.getIsPlaceHolder()) {
                    player.getClient().emit("other turn", otherDataObject);
                }
            }
        }
    }
    inquisitorVictimChosen(pClient, pData) {
        let claimant = this.getPlayerById(pClient.id);
        let victim = this.getPlayerById(pData);
        // victim has to guess what they are
        let dataObject = {};
        let deck = Deck.createDeck(this.numberOfNonPlaceHolderPlayers());
        dataObject.claimOptions = [];
        for (let i = 0; i < deck.numberOfCards(); i++) {
            let card = deck.getCard(i);
            dataObject.claimOptions.push(card.getName());         
        }
        victim.getClient().emit("make a guess", dataObject);
        let otherDataObject = {};
        otherDataObject.playerName = victim.getName();
        otherDataObject.message = "Didn't expect the Inquisitor! Now they have to identify themselves.";
        let total = this.numberOfPlayers();
        for(let i = 0; i < total; i +=1) {
            let player = this.getPlayer(i);
            if (player.getId() != victim.getId()) {
                if(!player.getIsPlaceHolder()) {
                    player.getClient().emit("other turn", otherDataObject);
                }
            }
        }

    }
    inquisitorVictimGuessed(pClient, pData) {
        let claimant = this.getRightfulClaimant(0);
        let victim = this.getPlayerById(pClient.id);
        if(victim.getCard().getName() != dData) {
            // guessed wrong pay the inquisitor
            let tempCoins = victim.getCoins();
            victim.removeCoins(4);
            if(tempCoins > 4) {
                tempCoins = 4;
            }
            claimant.addCoins(tempCoins);
            let claimResolution = claimant.getName() + " is the Inquisitor and has taken" + tempCoins + " coins from " + victim.getName() + " for guessing wrong.";
            this.setClaimResolution(claimResolution);
            this.finaliseClaims();
        }
        else {
            // guessed right nothing happens
            let claimResolution = claimant.getName() + " is the Inquisitor and " + victim.getName() + " guessed right.";
            this.setClaimResolution(claimResolution);
            this.finaliseClaims();
        }
    }
    swapOrNot(pTurn) {
        let player = pTurn.getPlayer();
        let dataObject = {};
        dataObject.players = [];
        for (let i = 0; i < this.numberOfPlayers(); i++) {
            let existingPlayer = this.getPlayer(i);
            if(player.getId() != existingPlayer.getId()) {                    
                let playerObject = {};
                playerObject.id = existingPlayer.getId();
                playerObject.name = existingPlayer.getName();
                dataObject.players.push(playerObject);
            }            
        }
        player.getClient().emit("swap or not", dataObject);
        let otherDataObject = {};
        otherDataObject.playerName = pTurn.getPlayer().getName();
        otherDataObject.message = "They are choosing who to swap with; or are they?";
        let total = this.numberOfPlayers();
        for(let i = 0; i < total; i +=1) {
            let player = this.getPlayer(i);
            if (player.getId() != pTurn.getPlayer().getId()) {
                if(!player.getIsPlaceHolder()) {
                    player.getClient().emit("other turn", otherDataObject);
                }
            }
        }
    }
    swapOrNotPlayerChosen(pTurn, pPlayerId) {
        let player = pTurn.getPlayer();
        let chosenPlayer = this.getPlayerById(pPlayerId);
        let dataObject = {};
        dataObject.playerid = pPlayerId;
        dataObject.playerName = chosenPlayer.getName();
        player.getClient().emit("swap or not result", dataObject);
        let otherDataObject = {};
        otherDataObject.playerName = pTurn.getPlayer().getName();
        otherDataObject.message = 'They are swapping with ' + chosenPlayer.getName() + '; or are they?';
        let total = this.numberOfPlayers();
        for(let i = 0; i < total; i +=1) {
            let player = this.getPlayer(i);
            if (player.getId() != pTurn.getPlayer().getId()) {
                if(!player.getIsPlaceHolder()) {
                    player.getClient().emit("other turn", otherDataObject);
                }
            }
        }
    }
    swapWithPlayerChosen(pTurn, pPlayerId) {
        let player = pTurn.getPlayer();
        let otherPlayer = this.getPlayerById(pPlayerId);

        let tempCard = player.getCard();

        player.setCard(otherPlayer.getCard());
        otherPlayer.setCard(tempCard);
        this.endTurn();
    }
    notWithPlayerChosen(pTurn, pPlayerId) {
        this.endTurn();
    }
    endTurn(pClient, pData) {
        let winner = this.hasAnyOneWon();
        if(winner == null) {
            this.incrementCurrentPlayerIndex();
            this.nextTurn();
        }
        else {
            // winner!
            console.log("winner " + winner.getName());
            let claimsResolution = winner.getName() + " has won with " + winner.getCoins() + " coins.";
            this.setClaimResolution(claimsResolution);
            this.setAllPlayersNotReady();
            this.setShouldShowGameOver(true);
            this.updateClientPlayers();
            let dataObject = {};
            dataObject.claimsResolution = this.getClaimResolution();
            
            let total = this.numberOfPlayers();
            for(let i = 0; i < total; i +=1) {
                let player = this.getPlayer(i);
                if(!player.getIsPlaceHolder()) {
                    console.log("telling " + player.getId() + " game over");
                    player.getClient().emit("game over", dataObject);
                }
                
            }
        }
    }

    endGame() {

    }

    hasAnyOneWon() {
        let total = this.numberOfPlayers();
        for(let i = 0; i < total; i +=1) {
            let player = this.getPlayer(i);
            if (player.getCoins() >= 13) {
                return player;
            }
        }
        return null;
    }

    areAllPlayersReady() {
        let count = 0;
        let total = this.numberOfPlayers();
        for(let i = 0; i < total; i +=1) {
            let player = this.getPlayer(i);
            if (player.getIsReady()) {
                count += 1;
            }
        }
        if(count == total) {
            return true;
        }
        return false;
    }

    setAllPlayersNotReady() {
        let total = this.numberOfPlayers();
        for(let i = 0; i < total; i +=1) {
            let player = this.getPlayer(i);
            if(!player.getIsPlaceHolder()) {
                player.setIsReady(false);
            }
        }
    }

    startGame() {
        let deck = Deck.createDeck(this.numberOfNonPlaceHolderPlayers());
        deck.shuffle();
        if(this.numberOfPlayers() < 5) {
            let placeHolderPlayer = new ServerPlayer(-1, "#000000", "PlaceHolder1", false, true);
            placeHolderPlayer.setIsReady(true);
            this.addPlayer(placeHolderPlayer);
        }
        if(this.numberOfPlayers() < 6) {
            let placeHolderPlayer = new ServerPlayer(-2, "#000000", "PlaceHolder2", false, true);
            placeHolderPlayer.setIsReady(true);
            this.addPlayer(placeHolderPlayer);
        }
        for(let i = 0; i < this.numberOfPlayers(); i+= 1) {
            let player = this.getPlayer(i);
            let card = deck.drawTopCard();
            player.setCard(card);
            player.setCoins(6);
            console.log(player.getId() + " has been dealt the " + card.getName() + " card.");            
        }
        this.resetClaims();
        this.setMandatorySwaps(4);
        this.setIsGameStarted(true);
        this.setShouldShowGameOver(false);
        this.setAllPlayersNotReady();
        this.setShouldShowCards(true);
        this.setCurrentPlayerIndex(this.pickRandomPlayerIndex());
        this.updateClientPlayers();
    }

    onPlayerNotReady(pClient, pData) {
        let player = this.getPlayerById(pClient.id);
        if (player != null) {
            player.setIsReady(false);
        }
        this.updateClientPlayers();
    }

    onPlayerResolutionReady(pClient, pData) {
        let player = this.getPlayerById(pClient.id);
        if (player != null) {
            player.setIsReady(true);
        }
        this.updateClientPlayers();
        if(this.areAllPlayersReady()) {
            this.resetClaims();
            this.setShouldShowResolution(false);
            this.updateClientPlayers();
            this.endTurn();
        }
    }
    onPlayerResolutionNotReady(pClient, pData) {
        let player = this.getPlayerById(pClient.id);
        if (player != null) {
            player.setIsReady(false);
        }
        this.updateClientPlayers();
    }

    onPlayerGameOverReady(pClient, pData) {
        let player = this.getPlayerById(pClient.id);
        if (player != null) {
            player.setIsReady(true);
        }
        this.updateClientPlayers();
        if(this.areAllPlayersReady()) {
            this.startGame();
        }
    }
    onPlayerGameOverNotReady(pClient, pData) {
        let player = this.getPlayerById(pClient.id);
        if (player != null) {
            player.setIsReady(false);
        }
        this.updateClientPlayers();
    }

    onStartGame(pClient, pData) {
        let deck = Deck.createDeck(this.numberOfNonPlaceHolderPlayers());
        deck.shuffle();
        if(this.numberOfPlayers() < 5) {
            let placeHolderPlayer = new ServerPlayer(-1, "#000000", "PlaceHolder1", false, true);
            pClient.broadcast.emit("new player", {id: placeHolderPlayer.getId(), colour: placeHolderPlayer.getColour(), name: placeHolderPlayer.getName(), isLocal: false, isPlaceHolder: true});
            pClient.emit("new player", {id: placeHolderPlayer.getId(), colour: placeHolderPlayer.getColour(), name: placeHolderPlayer.getName(), isLocal: false, isPlaceHolder: true});
            this.addPlayer(placeHolderPlayer);
        }
        if(this.numberOfPlayers() < 6) {
            let placeHolderPlayer = new ServerPlayer(-2, "#000000", "PlaceHolder2", false, true);
            pClient.broadcast.emit("new player", {id: placeHolderPlayer.getId(), colour: placeHolderPlayer.getColour(), name: placeHolderPlayer.getName(), isLocal: false, isPlaceHolder: true});
            pClient.emit("new player", {id: placeHolderPlayer.getId(), colour: placeHolderPlayer.getColour(), name: placeHolderPlayer.getName(), isLocal: false, isPlaceHolder: true});
            this.addPlayer(placeHolderPlayer);
        }
        for(let i = 0; i < this.numberOfPlayers(); i+= 1) {
            let player = this.getPlayer(i);
            let card = deck.drawTopCard();
            player.setCard(card);
            console.log(player.getId() + " has been dealt the " + card.getName() + " card.");
            pClient.broadcast.emit("deal card", {id: player.getId(), card: card.getName()});
            pClient.emit("deal card", {id: player.getId(), card: card.getName()});
        }
    };
    onHideCards(pClient, pData) {
        console.log("hiding cards");
        pClient.broadcast.emit("hide cards", {});
        pClient.emit("hide cards", {});
    };
    
    onShowCards(pClient, pData) {
        console.log("showing cards");
        pClient.broadcast.emit("show cards", {});
        pClient.emit("show cards", {});
    };
    onClientDisconnect(pClient, pData) {
        console.log("Player has disconnected: "+pClient.id);
        var removePlayer = this.getPlayerById(pClient.id);
        if (!removePlayer) {
            //could be trigger client?
            console.log("Player not found: "+pClient.id);
            return;
        };
        
        // Player not found
        
    
        // Remove player from players array
        this.removePlayer(removePlayer);
    
        // Broadcast removed player to connected socket clients
        pClient.broadcast.emit("remove player", {id: pClient.id});
    };
    /* onNewPlayer(pClient, pData) {
        // Create a new player
        if(false) {
            pClient.emit("game already started", {});
            return;
        }
        //generate a new player id and colour
        var newPlayer = new ServerPlayer(pClient.id, Utils.randomColour(), "No Name", false, false, pClient);
        
        // Broadcast new player to connected socket clients
        pClient.broadcast.emit("new player", {id: newPlayer.getId(), colour: newPlayer.getColour(), name: newPlayer.getName(), isLocal: false});
        console.log("sending new player to existing players: " + newPlayer.getId());
        
        
        // Send the new player all of the other players details
        var i, existingPlayer;
        for (i = 0; i < this.numberOfPlayers(); i++) {
            existingPlayer = this.getPlayer(i);
            let card = existingPlayer.getCard();
            let cardName = "";
            if(card != null) {
                cardName = card.getName();
            }
            pClient.emit("new player", {id: existingPlayer.getId(), colour: existingPlayer.getColour(), name: existingPlayer.getName(), card: cardName, isLocal: false, isPlaceHolder: existingPlayer.getIsPlaceHolder()});
            console.log("(" + i + ")" + "sending existing player list to new player: " + existingPlayer.getId());
        };
        // send the new player its new id, colour, and tile
        pClient.emit("new player id", {id: newPlayer.getId(), colour: newPlayer.getColour(), name: newPlayer.getName(), isLocal: true});
        console.log("sending new id new player: " + newPlayer.getId());
        // add new player to list of players
        this.addPlayer(newPlayer);
        
            
    }; */
    onNewPlayer(pClient, pData) {
        // Create a new player
        if(this.getIsGameStarted()) {
            pClient.emit("game already started", {});
            return;
        }
        //generate a new player id and colour
        var newPlayer = new ServerPlayer(pClient.id, Utils.randomColour(), "No Name", false, false, pClient);
        
        // add new player to list of players
        this.addPlayer(newPlayer);
        this.updateClientPlayers();
            
    };

    updateClientPlayers() {
        
        for (let i = 0; i < this.numberOfPlayers(); i++) {
            let currentPlayer = this.getPlayer(i);
            let dataObject = {};
            dataObject.isGameStarted = this.getIsGameStarted();
            dataObject.shouldShowCards = this.getShouldShowCards();
            dataObject.shouldShowResolution = this.getShouldShowResolution();
            dataObject.shouldShowGameOver = this.getShouldShowGameOver();
            dataObject.courthouseCoins = this.getCourthouseCoins();
            dataObject.players = [];
            for (let i = 0; i < this.numberOfPlayers(); i++) {
                let existingPlayer = this.getPlayer(i);
                let playerObject = {};
                playerObject.id = existingPlayer.getId();
                playerObject.colour = existingPlayer.getColour();
                playerObject.name = existingPlayer.getName();
                playerObject.coins = existingPlayer.getCoins();
                playerObject.isReady = existingPlayer.getIsReady();
                playerObject.card = "no card yet";
                if(existingPlayer.getCard() != null) {
                    playerObject.card = existingPlayer.getCard().getName();
                }
                playerObject.isLocal = false;
                if(currentPlayer.getId() == existingPlayer.getId()) {
                    playerObject.isLocal = true;
                }
                playerObject.isPlaceHolder = existingPlayer.getIsPlaceHolder();            
                dataObject.players.push(playerObject);
            }
            let client = currentPlayer.getClient();
            if (client != null) {
                client.emit("update players", dataObject);
            }
        }
    }

    onNameUpdate(pClient, pName) {
        let player = this.getPlayerById(pClient.id);
        if(player != null) {
            player.setName(pName);
        }
    
        this.updateClientPlayers();
    };
}
if (typeof exports !== 'undefined') {
    exports.ServerGame = ServerGame;
}
else {
    window.ServerGame = ServerGame;
}