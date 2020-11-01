const { ServerTurn } = require("./serverTurn");

class ServerGame {
    constructor() {
        this.mPlayers = [];
        this.setIsGameStarted(false);
        this.setShouldShowCards(false);
        this.setCurrentPlayerIndex(0);
        this.mTurns = [];
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
    setIsGameStarted(pIsGameStarted) {
        this.mIsGameStarted = pIsGameStarted;
    }
    getIsGameStarted() {
        return this.mIsGameStarted;
    }
    numberOfPlayers() {
        return this.mPlayers.length;
    };
    getPlayer(pIndex) {
        if(pIndex < this.numberOfPlayers()) {
            return this.mPlayers[pIndex];
        }
        return null;
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
        let lookTurnOption = {};
        lookTurnOption.id = "lookAtCard";
        lookTurnOption.text = "Look At Card";
        dataObject.turnOptions.push(lookTurnOption);
        let swapTurnOption = {};
        swapTurnOption.id = "swapOrNot";
        swapTurnOption.text = "Swap Or Not";
        dataObject.turnOptions.push(swapTurnOption);
        let claimTurnOption = {};
        claimTurnOption.id = "makeAClaim";
        claimTurnOption.text = "Make a Claim";
        dataObject.turnOptions.push(claimTurnOption);        
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
        if(pClient.id = player.getId()) {
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
        let deck = Deck.createDeck(this.numberOfPlayers());
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
            console.log(player.getId() + " has been dealt the " + card.getName() + " card.");            
        }
        this.setIsGameStarted(true);
        this.setAllPlayersNotReady();
        this.setShouldShowCards(true);
        this.updateClientPlayers();
    }

    onPlayerNotReady(pClient, pData) {
        let player = this.getPlayerById(pClient.id);
        if (player != null) {
            player.setIsReady(false);
        }
        this.updateClientPlayers();
    }

    onStartGame(pClient, pData) {
        let deck = Deck.createDeck(this.numberOfPlayers());
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