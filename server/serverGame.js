class ServerGame {
    constructor() {
        this.mPlayers = [];
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
    };
    onStartGame(pClient, pData) {
        let deck = Deck.createDeck(this.numberOfPlayers());
        deck.shuffle();
        if(this.numberOfPlayers() < 5) {
            let placeHolderPlayer = new Player(-1, "#000000", "PlaceHolder1", false, true);
            pClient.broadcast.emit("new player", {id: placeHolderPlayer.getId(), colour: placeHolderPlayer.getColour(), name: placeHolderPlayer.getName(), isLocal: false, isPlaceHolder: true});
            pClient.emit("new player", {id: placeHolderPlayer.getId(), colour: placeHolderPlayer.getColour(), name: placeHolderPlayer.getName(), isLocal: false, isPlaceHolder: true});
            this.addPlayer(placeHolderPlayer);
        }
        if(this.numberOfPlayers() < 6) {
            let placeHolderPlayer = new Player(-2, "#000000", "PlaceHolder2", false, true);
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
    onNewPlayer(pClient, pData) {
        // Create a new player
        if(false) {
            pClient.emit("game already started", {});
            return;
        }
        //generate a new player id and colour
        var newPlayer = new Player(pClient.id, Utils.randomColour(), "No Name", false);
        
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
        
            
    };
    onNameUpdate(pClient, pData) {
        let dataObject = JSON.parse(pData);
        let player = this.getPlayerById(dataObject.playerId);
        player.setName(dataObject.name);
    
        pClient.broadcast.emit("name update", {id: player.getId(), name: player.getName()});
    };
}
if (typeof exports !== 'undefined') {
    exports.ServerGameFish = ServerGame;
}
else {
    window.ServerGameFish = ServerGame;
}