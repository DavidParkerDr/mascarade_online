const { ServerTurn } = require("./serverTurn");

class ServerGame {
    constructor() {
        this.mPlayers = [];
        this.mTurns = [];
        this.initialiseValues();
    }
    initialiseValues() {
        this.setIsGameStarted(false);
        this.setShouldShowCards(false);
        this.setShouldShowResolution(false);
        this.setShouldShowGameOver(false);
        this.setCurrentPlayerIndex(0);
        this.setCourthouseCoins(0);     
        
        this.setReadyReplyMessage("player ready");
        this.setShowId(false);
        this.setShowCards(false);
        this.setShowCoins(false);
        this.setShowCourthouse(false);
        this.setShowUpdate(true);
        this.setShowReady(true);
    }
    setShowReady(pShowReady) {
        this.mShowReady = pShowReady;
    }
    getShowReady() {
        return this.mShowReady;
    }
    setShowCourthouse(pShowCourthouse) {
        this.mShowCourthouse = pShowCourthouse;
    }
    getShowCourthouse() {
        return this.mShowCourthouse;
    }
    setShowCards(pShowCards) {
        this.mShowCards = pShowCards;
    }
    getShowCards() {
        return this.mShowCards;
    }
    setShowId(pShowId) {
        this.mShowId = pShowId;
    }
    getShowId() {
        return this.mShowId;
    }
    setShowCoins(pShowCoins) {
        this.mShowCoins = pShowCoins;
    }
    getShowCoins() {
        return this.mShowCoins;
    }
    setShowUpdate(pShowUpdate) {
        this.mShowUpdate = pShowUpdate;
    }
    getShowUpdate() {
        return this.mShowUpdate;
    }
    setReadyReplyMessage(pReadyReplyMessage) {
        this.mReadyReplyMessage = pReadyReplyMessage;
    }
    getReadyReplyMessage() {
        return this.mReadyReplyMessage;
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
    
    setCourthouseCoins(pCourthouseCoins) {
        this.mCourthouseCoins = pCourthouseCoins;
    }
    getCourthouseCoins() {
        return this.mCourthouseCoins;
    }
    addCourthouseCoins(pCourthouseCoins) {
        this.mCourthouseCoins += pCourthouseCoins;
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
        client.on("end turn", this.endTurn.bind(this, client));

        client.on("hide cards", this.onHideCards.bind(this, client));
        client.on("show cards", this.onShowCards.bind(this, client));

        client.on("player ready", this.onPlayerReady.bind(this, client));
        client.on("player not ready", this.onPlayerNotReady.bind(this, client));

        client.on("turn choice made", this.turnChoice.bind(this, client));
        client.on("finish enacting claims", this.onPlayerFinishEnactingClaims.bind(this, client));
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

        client.on("player game over ready", this.onPlayerGameOverReady.bind(this, client));

    };

    onPlayerReady(pClient, pData) {
        let player = this.getPlayerById(pClient.id);
        if (player != null) {
            player.setIsReady(true);
        }
        this.updateClientPlayers();
        if(this.areAllPlayersReady()) {
            if(this.getIsGameStarted()) {
                this.setShowCards(false);
                this.setShowCourthouse(true);
                this.setShowCoins(true);
                this.setShowUpdate(false);
                this.setShowReady(false);
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
        this.setShowReady(false);
        let currentPlayer = this.getPlayer(this.getCurrentPlayerIndex());
        while(currentPlayer.getIsPlaceHolder()) {
            this.incrementCurrentPlayerIndex();
            currentPlayer = this.getPlayer(this.getCurrentPlayerIndex());
        }
        let turn = new ServerTurn(currentPlayer);
        this.addTurn(turn);
        this.sendTurnOptions();
    }

    sendTurnOptions() {
        let turn = this.getLatestTurn();
        let player = turn.getPlayer();
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
        player.getClient().emit("your turn", dataObject);
        let otherDataObject = {};
        otherDataObject.playerName = player.getName();
        otherDataObject.message = "They are deciding what to do.";
        let total = this.numberOfPlayers();
        for(let i = 0; i < total; i +=1) {
            let player = this.getPlayer(i);
            if (player.getId() != player.getId()) {
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
                this.lookAtCard();
            }
            else if(pData.choice == "swapOrNot") {
                this.swapOrNot();
            }
            else if(pData.choice == "swapOrNotPlayerChosen") {
                this.swapOrNotPlayerChosen(pData.playerid);
            }
            else if(pData.choice == "swapWithPlayerChosen") {
                this.swapWithPlayerChosen(pData.playerid);
            }
            else if(pData.choice == "notWithPlayerChosen") {
                this.notWithPlayerChosen(pData.playerid);
            }
            else if(pData.choice == "makeAClaim") {
                this.makeAClaim();
            }
            else if(pData.choice == "madeAClaim") {
                this.madeAClaim(pData.claimOption);
            }
        }
        else {
            if(pData.choice == "madeACounterClaim") {
                this.madeACounterClaim(pClient.id);
            }
            else if(pData.choice == "keptQuiet") {
                this.keptQuiet(pClient.id);
            }
        }
    }

    madeACounterClaim(pPlayerId) {
        let turn = this.getLatestTurn();
        let player = this.getPlayerById(pPlayerId);
        console.log(pPlayerId + " made counter claim. " + player.getName());
        turn.addClaimingPlayer(player);
        this.subsequentClaim();
    }
    keptQuiet(pPlayerId) {
        let turn = this.getLatestTurn();
        let player = this.getPlayerById(pPlayerId);
        console.log(pPlayerId + " kept quiet. " + player.getName());
        this.subsequentClaim();
    }
    madeAClaim(pClaimOption) {
        let turn = this.getLatestTurn();
        let player = turn.getPlayer();
        turn.setClaimPlayerIndex(this.getCurrentPlayerIndex());
        turn.addClaimingPlayer(player);
        turn.setClaim(pClaimOption);
        this.subsequentClaim();
    }
    subsequentClaim()
    {
        let turn = this.getLatestTurn();
        let player = turn.getPlayer();
        this.incrementCurrentPlayerIndex();
        let nextClaimant = this.getPlayer(this.getCurrentPlayerIndex());
        while(nextClaimant.getIsPlaceHolder()) {
            this.incrementCurrentPlayerIndex();
            nextClaimant = this.getPlayer(this.getCurrentPlayerIndex());
        }
        if(this.getCurrentPlayerIndex() != turn.getClaimPlayerIndex()) {
            
            let dataObject = {};
            dataObject.player = nextClaimant.getName();
            dataObject.claimOption = turn.getClaim();
            dataObject.claims = [];
            for (let i = 0; i < this.numberOfClaimingPlayers(); i +=1) {
                let claimingPlayer = turn.getClaimingPlayer(i);
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
                turn.addRightfulClaimant(turn.getClaimingPlayer(0));
                let logEntry = turn.getClaimingPlayer(0).getName() + "'s claim to be the " + turn.getClaim() + " was uncontested.";
                this.addLogEntry(logEntry);
            }                 
            

            if(this.numberofRightfulClaimants() == 0) {
                // no successful claims
                console.log("everyone was wrong");
                let logEntry = "Everyone was wrong.";
                this.addLogEntry(logEntry);                         
                
            }
            else if(this.numberofRightfulClaimants() == 1) {
                let logEntry = turn.getRightfulClaimant(0).getName() + "'s claim to be the " + turn.getClaim() + " is righteous.";
                this.addLogEntry(logEntry);
            }
            else if(this.numberofRightfulClaimants() == 2) {
                let logEntry = turn.getRightfulClaimant(0).getName() + " and " + turn.getClaimingPlayer(1).getName() + " are both " + turn.getClaim() + "s.";
                this.addLogEntry(logEntry);    
            }
            
            this.finaliseClaims();      
            
        }
    }
    checkMandatorySwaps() {
        let mandatorySwapsNeeded = false;
        if(this.numberOfClaimingPlayers() > 1) {
            for(let i = 0; i < this.numberOfClaimingPlayers(); i+=1) {
                let claimant = turn.getClaimingPlayer(i);
                let claimantIndex = this.getPlayerIndex(claimant.getId());
                let nextPlayerIndex = this.getNextPlayerIndex();
                if(claimantIndex == nextPlayerIndex) {
                    mandatorySwapsNeeded = true;
                    break;
                }
            }
        }
        if(mandatorySwapsNeeded) {
            this.setMandatorySwaps(1);
        }
    }
    enactClaim() {
        let turn = this.getLatestTurn();
        let claim = turn.getClaim();
        if(claim == "Judge") {
            // take the coins from the courthouse
            let rightfulClaimant = turn.getRightfulClaimant(0);
            rightfulClaimant.addCoins(this.getCourthouseCoins());
            let logEntry = rightfulClaimant.getName() + " is the Judge and took " + this.getCourthouseCoins() +  " coins from the Courthouse.";
            this.addLogEntry(logEntry);
            this.setCourthouseCoins(0);         
            this.finishEnactingClaims();    
        }
        else if(claim == "Bishop") {
            // takes 2 coins from the richest player
            let rightfulClaimant = turn.getRightfulClaimant(0);
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
                    else if(player.getCoins() == biggestFortune) {       
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
                let logEntry = rightfulClaimant.getName() + " is the Bishop and took " + tempCoins +  " coins from " + richestPlayer.getName();
                this.addLogEntry(logEntry);
                this.finishEnactingClaims();
            }
            else {
                // Bishop needs to choose victim
                this.chooseBishopVictim(rightfulClaimant, richestPlayers);
            }
            
        }
        else if(claim == "King") {
            // take 3 coins
            let rightfulClaimant = turn.getRightfulClaimant(0);
            rightfulClaimant.addCoins(3);
            let logEntry = rightfulClaimant.getName() + " is the King and took " + 3 +  " coins from the Bank.";
            this.addLogEntry(logEntry);
            this.finishEnactingClaims();
        }
        else if(claim == "Fool") {
            // take 1 coin and swap or not two other players cards
            let rightfulClaimant = turn.getRightfulClaimant(0);
            rightfulClaimant.addCoins(1);
            // choose 2 people to swap or not
            this.chooseFoolVictims(rightfulClaimant);
        }
        else if(claim == "Queen") {
            // take 2 coins
            let rightfulClaimant = turn.getRightfulClaimant(0);
            rightfulClaimant.addCoins(2);
            let logEntry = rightfulClaimant.getName() + " is the Queen and took " + 2 +  " coins from the Bank.";
            this.addLogEntry(logEntry);
            this.finishEnactingClaims();
        }
        else if(claim == "Thief") {
            // takes a coin from the adjacent players
            let rightfulClaimant = turn.getRightfulClaimant(0);
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
            let logEntry = rightfulClaimant.getName() + " is the Thief and took " + tempCoins1 +  " coins from " + leftVictim.getName() + " and " + tempCoins2 + " coins from " + rightVictim.getName();
            this.addLogEntry(logEntry);
            this.finishEnactingClaims();
        }
        else if(claim == "Witch") {
            // swap coins with another player
            let rightfulClaimant = turn.getRightfulClaimant(0);
            this.chooseWitchVictim(rightfulClaimant);
        }
        else if(claim == "Spy") {
            // looks at their card and another players card and then swaps or not
            let rightfulClaimant = turn.getRightfulClaimant(0);
            this.chooseSpyVictim(rightfulClaimant);
        }
        else if(claim == "Peasant") {
            // take 1 coin unless both peasants have rightfully claimed
            let coins = 1;
            let logEntry = "";
            
            if(this.numberofRightfulClaimants() > 1) {
                coins = 2;
            }
            for(let i = 0; i < this.numberofRightfulClaimants(); i +=1) {
                let rightfulClaimant = turn.getRightfulClaimant(i);
                rightfulClaimant.addCoins(coins);
                if(i != 0) {
                    claimResolution += " and ";
                }
                logEntry += rightfulClaimant.getName();
            }
            if(this.numberofRightfulClaimants() > 1) {
                logEntry += " are Peasants";
            }
            else {
                logEntry += " is a Peasant";
            }
            logEntry += " and have taken " + coins + " coins from the Bank.";
            this.addLogEntry(logEntry);
            this.finishEnactingClaims();
        }
        else if(claim == "Cheat") {
            // can win with only 10 coins
            let rightfulClaimant = turn.getRightfulClaimant(0);
            if(rightfulClaimant.getCoins() >= 10) {
                // cheat wins
                let logEntry = rightfulClaimant.getName() + " is the Cheat and has won with " + rightfulClaimant.getCoins() + " coins.";
                this.addLogEntry(logEntry);
                this.endGame();
            }
            else {
                let logEntry = rightfulClaimant.getName() + " is the Cheat but is too poor to win.";
                this.addLogEntry(logEntry);
                this.finishEnactingClaims();
            }
            
        }
        else if(claim == "Inquisitor") {
            // chooses another player to guess their own card, if they are wrong they pay the Inquisitor 4 coins
            let rightfulClaimant = turn.getRightfulClaimant(0);
            this.chooseInquisitorVictim(rightfulClaimant);
        }
        else if(claim == "Widow") {
            // fortune topped up to 10 coins
            let rightfulClaimant = turn.getRightfulClaimant(0);
            if(rightfulClaimant.getCoins() < 10) {
                rightfulClaimant.setCoins(10);
                let logEntry = rightfulClaimant.getName() + " is the Widow and has topped up her fortune to 10 coins.";
                this.addLogEntry(logEntry);
            }
            else {
                let logEntry = rightfulClaimant.getName() + " is the Widow but they already had 10 coins.";
                this.addLogEntry(logEntry);
            }
            this.finishEnactingClaims();
        }
    }
    finishEnactingClaims() {
        let turn = this.getLatestTurn();
        console.log("finishing enacting claims:  " + turn.getClaimResolution());
        this.setAllPlayersNotReady();
        this.setShouldShowResolution(true);
        // update reply message here
        this.setReadyReplyMessage("finish enacting claims");
        this.addCourthouseCoins(turn.getFines());
        this.setShowReady(true);
        this.updateClientPlayers();
        let dataObject = {};
        dataObject.claimsResolution = turn.getClaimResolution();
        dataObject.claim = turn.getClaim(); 
        dataObject.falseClaims = [];
        let total = this.numberOfPlayers();
        for(let i = 0; i < total; i +=1) {
            let player = this.getPlayer(i);
            if(!player.getIsPlaceHolder()) {
                player.getClient().emit("claims resolution", dataObject);
            }            
        }
    }

    finaliseClaims() {
        let turn = this.getLatestTurn();
        console.log("finaliseClaims " + turn.getClaimResolution());
        //this.fineFalseClaims();
        this.checkMandatorySwaps();
        this.setAllPlayersNotReady();
        this.setShouldShowResolution(true);
        this.setReadyReplyMessage("player resolution ready");
        this.setShowReady(true);
        this.updateClientPlayers();
        let dataObject = {};
        dataObject.claimsResolution = turn.getClaimResolution();
        dataObject.claim = turn.getClaim();      
        dataObject.falseClaims = [];
        for(let i = 0; i < turn.numberOfFalselyClaimingPlayers(); i +=1) {
            let claimObject = {};
            let falselyClaimingPlayer = turn.getFalselyClaimingPlayer(i);  
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
        let turn = this.getLatestTurn();
        for(let i = 0; i < turn.numberOfClaimingPlayers(); i +=1) {
            let claimingPlayer = turn.getClaimingPlayer(i);
            let card = claimingPlayer.getCard();
            if(card.getName() != turn.getClaim()) {
                // false claim
                turn.addFalselyClaimingPlayer(claimingPlayer);
            }
            else {
                // rightful claim
                turn.addRightfulClaimant(claimingPlayer);
            }
        }
        turn.fineFalseClaims();
        
    }
    
    
    makeAClaim() {
        let turn = this.getLatestTurn();
        let player = turn.getPlayer();
        let dataObject = {};
        let deck = Deck.createDeck(this.numberOfNonPlaceHolderPlayers());
        dataObject.claimOptions = [];
        for (let i = 0; i < deck.numberOfCards(); i++) {
            let card = deck.getCard(i);
            dataObject.claimOptions.push(card.getName());         
        }
        player.getClient().emit("make a claim", dataObject);
        let otherDataObject = {};
        otherDataObject.playerName = player.getName();
        otherDataObject.message = "They are preparing an announcement!";
        let total = this.numberOfPlayers();
        for(let i = 0; i < total; i +=1) {
            let player = this.getPlayer(i);
            if (player.getId() != player.getId()) {
                if(!player.getIsPlaceHolder()) {
                    player.getClient().emit("other turn", otherDataObject);
                }
            }
        }
    }

    lookAtCard() {
        let turn = this.getLatestTurn();
        let player = turn.getPlayer();
        player.getClient().emit("look at card", {card: player.getCard().getName()});
        let otherDataObject = {};
        otherDataObject.playerName = player.getName();
        otherDataObject.message = "They are looking at their card.";
        let total = this.numberOfPlayers();
        for(let i = 0; i < total; i +=1) {
            let player = this.getPlayer(i);
            if (player.getId() != player.getId()) {
                if(!player.getIsPlaceHolder()) {
                    player.getClient().emit("other turn", otherDataObject);
                }
            }
        }
    }

    chooseBishopVictim(pClaimant, pRichestPlayers) {
        let turn = this.getLatestTurn();
        let claimant = pClaimant;
        let dataObject = {};
        dataObject.victims = [];
        for(let i = 0; i < pRichestPlayers.length; i +=1) {
            let richestPlayer = pRichestPlayers[i];
            let victimObject = {id: richestPlayer.getId(), name: richestPlayer.getName()};
            dataObject.victims.push(victimObject);
        }
        let logEntry = "They are the Bishop, choosing their victim.";
        turn.addLogEntry(logEntry);
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
        let turn = this.getLatestTurn();
        let claimant = this.getPlayerById(pClient.id);
        let victim = this.getPlayerById(pData.id);
        
        let tempCoins = victim.getCoins();
        victim.removeCoins(2);
        if(tempCoins > 2) {
            tempCoins = 2;
        }
        claimant.addCoins(tempCoins);
        let logEntry = claimant.getName() + " is the Bishop and took " + tempCoins +  " coins from " + victim.getName();
        turn.addLogEntry(logEntry);
        this.finishEnactingClaims();
    }
    chooseWitchVictim(pClaimant) {
        let turn = this.getLatestTurn();
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
        let logEntry = claimant.getName() + " is the Witch, choosing their victim.";
        turn.addLogEntry(logEntry);
        claimant.getClient().emit("choose witch victim", dataObject);
        let otherDataObject = {};
        otherDataObject.playerName = claimant.getName();
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
        let turn = this.getLatestTurn();
        let claimant = this.getPlayerById(pClient.id);
        let victim = this.getPlayerById(pData.id);
        let tempCoins = claimant.getCoins();
        claimant.setCoins(victim.getCoins());
        victim.setCoins(tempCoins);  
        let logEntry = claimant.getName() + " is the Witch and swapped fortune with " + victim.getName();
        turn.addLogEntry(logEntry);
        this.finishEnactingClaims();
    }
    chooseFoolVictims(pClaimant) {
        let turn = this.getLatestTurn();
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
        claimant.getClient().emit("choose fool victims", dataObject);
        let logEntry = claimant.getName() + " is the Fool, choosing their victims.";
        turn.addLogEntry(logEntry);
        let otherDataObject = {};
        otherDataObject.playerName = claimant.getName();
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
        let turn = this.getLatestTurn();
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
        claimant.getClient().emit("fool swap or not result", dataObject);
        let logEntry = claimant.getName() + ' is the Fool. They are swapping ' + victim1.getName() + ' with ' + victim2.getName() + '; or are they?';
        turn.addLogEntry(logEntry);
        let otherDataObject = {};
        otherDataObject.playerName = claimant.getName();
        otherDataObject.message = claimant.getName() + ' is the Fool. They are swapping ' + victim1.getName() + ' with ' + victim2.getName() + '; or are they?';
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
        let turn = this.getLatestTurn();
        let claimant = this.getPlayerById(pClient.id);
        let victim1 = this.getPlayerById(pData.victim1);
        let victim2 = this.getPlayerById(pData.victim2);

        let tempCard = victim1.getCard();

        victim1.setCard(victim2.getCard());
        victim2.setCard(tempCard);

        // fool swapped victims cards
        let logEntry = claimant.getName() + " is the Fool and swapped " + victim1.getName() + " and " + victim2.getName() + "; or did they?";
        turn.addLogEntry(logEntry);
        this.finishEnactingClaims();
    }
    foolNotChosen(pClient, pData){
        let turn = this.getLatestTurn();
        let claimant = this.getPlayerById(pClient.id);
        let victim1 = this.getPlayerById(pData.victim1);
        let victim2 = this.getPlayerById(pData.victim2);
        // fool didn't swap victims cards
        let logEntry = claimant.getName() + " is the Fool and swapped " + victim1.getName() + " and " + victim2.getName() + "; or did they?";
        turn.addLogEntry(logEntry);
        this.finishEnactingClaims();
    }
    chooseSpyVictim(pClaimant) {
        let turn = this.getLatestTurn();
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
        claimant.getClient().emit("choose spy victim", dataObject);
        let logEntry = claimant.getName() + " is the Spy, choosing their victim.";
        turn.addLogEntry(logEntry);
        let otherDataObject = {};
        otherDataObject.playerName = claimant.getName();
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
        let turn = this.getLatestTurn();
        let claimant = this.getPlayerById(pClient.id);
        let victim = this.getPlayerById(pData.id);

        // need to swap or not
        let dataObject = {};
        dataObject.playerid = claimant.getId();
        dataObject.playerCard = claimant.getCard().getName();
        dataObject.victimId = victim.getId();
        dataObject.victimName = victim.getName();
        dataObject.victimCard = victim.getCard().getName();
        claimant.getClient().emit("spy swap or not result", dataObject);
        let logEntry = claimant.getName() + ' is the Spy. They are swapping with ' + victim.getName() + '; or are they?';
        turn.addLogEntry(logEntry);
        let otherDataObject = {};
        otherDataObject.playerName = claimant.getName();
        otherDataObject.message = claimant.getName() + ' is the Spy. They are swapping with ' + victim.getName() + '; or are they?';
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
        let turn = this.getLatestTurn();
        let victim = this.getPlayerById(pData.victimId);
        let claimant = this.getPlayerById(pClient.id);

        let tempCard = claimant.getCard();

        claimant.setCard(victim.getCard());
        victim.setCard(tempCard);

        // spy swapped victims cards
        let logEntry = claimant.getName() + " is the Spy and swapped with " + victim.getName() + "; or did they?";
        turn.addLogEntry(logEntry)
        this.finishEnactingClaims();
    }
    spyNotChosen(pClient, pData){
        let turn = this.getLatestTurn();
        let victim = this.getPlayerById(pData.victim);
        let claimant = this.getPlayerById(pClient.id);
        // spy didn't swap victims cards
        let logEntry = claimant.getName() + " is the Spy and swapped with " + victim.getName() + "; or did they?";
        turn.addLogEntry(logEntry)
        this.finishEnactingClaims();
    }
    chooseInquisitorVictim(pClaimant) {
        let turn = this.getLatestTurn();
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
        claimant.getClient().emit("choose inquisitor victim", dataObject);
        let logEntry = claimant.getName() + " is the Inquisitor, choosing their victim.";
        turn.addLogEntry(logEntry)
        let otherDataObject = {};
        otherDataObject.playerName = claimant.getName();
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
        let turn = this.getLatestTurn();
        let claimant = this.getPlayerById(pClient.id);
        let victim = this.getPlayerById(pData.id);
        // victim has to guess what they are
        let dataObject = {};
        let deck = Deck.createDeck(this.numberOfNonPlaceHolderPlayers());
        dataObject.claimOptions = [];
        for (let i = 0; i < deck.numberOfCards(); i++) {
            let card = deck.getCard(i);
            dataObject.claimOptions.push(card.getName());         
        }
        victim.getClient().emit("make a guess", dataObject);
        let logEntry = victim.getName() + " didn't expect the Inquisitor! Now they have to identify themselves.";
        turn.addLogEntry(logEntry)
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
        let turn = this.getLatestTurn();
        let claimant = turn.getRightfulClaimant(0);
        let victim = this.getPlayerById(pClient.id);
        if(victim.getCard().getName() != pData) {
            // guessed wrong pay the inquisitor
            let tempCoins = victim.getCoins();
            victim.removeCoins(4);
            if(tempCoins > 4) {
                tempCoins = 4;
            }
            claimant.addCoins(tempCoins);
            let logEntry = claimant.getName() + " is the Inquisitor and has taken " + tempCoins + " coins from " + victim.getName() + " for guessing wrong.";
            turn.addLogEntry(logEntry)
            this.finishEnactingClaims();
        }
        else {
            // guessed right nothing happens
            let logEntry = claimant.getName() + " is the Inquisitor and " + victim.getName() + " correctly guessed that they were the " + victim.getCard().getName() + ".";
            turn.addLogEntry(logEntry)
            
            this.finishEnactingClaims();
        }
    }
    swapOrNot() {
        let turn = this.getLatestTurn();
        let player = turn.getPlayer();
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
        let logEntry = player.getName() + " is choosing who to swap with; or are they?";
        turn.addLogEntry(logEntry)
        let otherDataObject = {};
        otherDataObject.playerName = player.getName();
        otherDataObject.message = "They are choosing who to swap with; or are they?";
        let total = this.numberOfPlayers();
        for(let i = 0; i < total; i +=1) {
            let player = this.getPlayer(i);
            if (player.getId() != player.getId()) {
                if(!player.getIsPlaceHolder()) {
                    player.getClient().emit("other turn", otherDataObject);
                }
            }
        }
    }
    swapOrNotPlayerChosen(pPlayerId) {
        let turn = this.getLatestTurn();
        let player = turn.getPlayer();
        let chosenPlayer = this.getPlayerById(pPlayerId);
        let dataObject = {};
        dataObject.playerid = pPlayerId;
        dataObject.playerName = chosenPlayer.getName();
        player.getClient().emit("swap or not result", dataObject);
        let logEntry = player.getName() + " is swapping with " + chosenPlayer.getName() + "; or are they?";
        turn.addLogEntry(logEntry);
        
        let otherDataObject = {};
        otherDataObject.playerName = player.getName();
        otherDataObject.message = 'They are swapping with ' + chosenPlayer.getName() + '; or are they?';
        let total = this.numberOfPlayers();
        for(let i = 0; i < total; i +=1) {
            let player = this.getPlayer(i);
            if (player.getId() != player.getId()) {
                if(!player.getIsPlaceHolder()) {
                    player.getClient().emit("other turn", otherDataObject);
                }
            }
        }
    }
    swapWithPlayerChosen(pPlayerId) {
        let turn = this.getLatestTurn();
        let player = turn.getPlayer();
        let otherPlayer = this.getPlayerById(pPlayerId);

        let tempCard = player.getCard();

        player.setCard(otherPlayer.getCard());
        otherPlayer.setCard(tempCard);
        this.endTurn();
    }
    notWithPlayerChosen() {
        this.endTurn();
    }
    endTurn(pClient, pData) {
        let turn = this.getLatestTurn();
        let winner = this.hasAnyOneWon();
        if(winner == null) {
            this.incrementCurrentPlayerIndex();
            this.nextTurn();
        }
        else {
            let logEntry = winner.getName() + " has won with " + winner.getCoins() + " coins.";
            turn.addLogEntry(logEntry)
            this.endGame();
        }
    }

    endGame() {
        // winner!
        console.log("winner " + turn.getClaimResolution());
        
        this.setAllPlayersNotReady();
        this.setShouldShowGameOver(true);
        this.setReadyReplyMessage("player game over ready");
        this.setShowReady(true);
        this.setShowCards(true);
        
        this.updateClientPlayers();
        let dataObject = {};
        dataObject.claimsResolution = turn.getClaimResolution();
        let total = this.numberOfPlayers();
        for(let i = 0; i < total; i +=1) {
            let player = this.getPlayer(i);
            if(!player.getIsPlaceHolder()) {
                console.log("telling " + player.getId() + " game over");
                player.getClient().emit("game over", dataObject);
            }
            
        }
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
        this.setReadyReplyMessage("player ready");
        this.setMandatorySwaps(4);
        this.setIsGameStarted(true);
        this.setCourthouseCoins(0);
        this.setAllPlayersNotReady();
        this.setShowCards(true);
        this.setShowCoins(true);
        this.setShowCourthouse(true);
        this.setShowUpdate(false);
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
            if(this.numberofRightfulClaimants() > 0) {
                this.enactClaim();
            }
            else {
                this.addCourthouseCoins(this.getFines());
                this.resetClaims();
                this.setShouldShowResolution(false);
                this.setShowReady(false);
                this.updateClientPlayers();
                this.endTurn();
            }
        }
    }
    onPlayerFinishEnactingClaims(pClient, pData) {
        let player = this.getPlayerById(pClient.id);
        if (player != null) {
            player.setIsReady(true);
        }
        this.updateClientPlayers();
        if(this.areAllPlayersReady()) {
            this.resetClaims();
            this.setShouldShowResolution(false);
            this.setShowReady(false);
            this.updateClientPlayers();
            this.endTurn();
        }
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
        var newPlayer = new ServerPlayer(pClient.id, Utils.randomColour(), "Player " + (this.numberOfNonPlaceHolderPlayers() + 1), false, false, pClient);
        
        // add new player to list of players
        this.addPlayer(newPlayer);
        this.updateClientPlayers();
            
    };

    buildPlayersDataObject(pCurrentPlayer, pIncludeCards) {
        let playersList = [];
        for( let i = 0; i < this.numberOfPlayers() ; i +=1) {
            let player = this.getPlayer(i);
            let playerObject = player.getJsonObject(pIncludeCards);
            playerObject.isLocal = (pCurrentPlayer.getId() == player.getId());
            playersList.push(playerObject);
        }
        return playersList;
    }

    updateClientPlayers() {
        
        for (let i = 0; i < this.numberOfPlayers(); i++) {
            let currentPlayer = this.getPlayer(i);
            let dataObject = {};
            dataObject.showId = this.getShowId();
            dataObject.showCards = this.getShowCards();
            dataObject.showCoins = this.getShowCoins();
            dataObject.showCourthouse = this.getShowCourthouse();
            dataObject.showUpdate = this.getShowUpdate();
            dataObject.showReady = this.getShowReady();
            dataObject.readyReplyMessage = this.getReadyReplyMessage();            
            
            dataObject.players = this.buildPlayersDataObject(currentPlayer, this.getShowCards());
            if(this.getShowCourthouse()) {
                dataObject.courthouseCoins = this.getCourthouseCoins();
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