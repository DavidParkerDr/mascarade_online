class Game {
    constructor(pCanvas, pContext) {
        this.mMainCanvas = pCanvas;
        this.mMainContext = pContext;
        // player
        this.mLocalPlayer = new Player(0, '#cc0000', "No Name", true);
        
        // all Players
        this.mPlayers = [];
        // socket
        this.mSocket = io();
        
        this.setEventHandlers();
        
        this.resizeCanvas();
        this.setFirstVictim(null);
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

    setFirstVictim(pVictim) {
        this.mFirstVictim = pVictim;
    }
    getFirstVictim() {
        return this.mFirstVictim;
    }
    relMouseCoords(event) {
        var rect, root, mouseX, mouseY, mousePos;
        rect = this.mMainCanvas.getBoundingClientRect();
        root = document.documentElement;
        // return relative mouse position
        mouseX = event.clientX - rect.left - root.scrollLeft;
        mouseY = event.clientY - rect.top - root.scrollTop;
        mousePos = new Vector(mouseX, mouseY, 1);
        return mousePos;
    };
    resizeCanvas() {
        var backgroundVertices;
        this.mMainCanvas.width = window.innerWidth;
        this.mMainCanvas.height = window.innerHeight;
    };
    // Socket connected
    onSocketConnected() {
        console.log("Connected to socket server");
        // Send local player data to the game server
        this.mSocket.emit("new player", {});
        this.mPlayers = [];
    };

    // Socket disconnected
    onSocketDisconnect() {
        console.log("Disconnected from socket server");
    };

    // Socket disconnected
    onJoinRejected() {
        console.log("Game already started, can't join");
    };

    // New player
    onNewPlayer(data) {
        console.log("New player connected: " + data.id + ', ' + data.colour + ', ' + data.name);

        // Initialise the new player
        var newRemotePlayer = new Player(data.id, data.colour, data.name, data.isLocal, data.isPlaceHolder);
        if(data.card != "") {
            let card = new Card(data.card);
            newRemotePlayer.setCard(card);
        }

        // Add new player to the remote players array
        this.mPlayers.push(newRemotePlayer);

        this.updatePlayersArea();
    };

    onNewPlayerName(data) {
        console.log("New player name: " + data.id + ', '  + data.name);

        // Initialise the new player
        var remotePlayer = this.getPlayerById(data.id);

        remotePlayer.setName(data.name);

        this.updatePlayersArea();
    };

      updatePlayersAreaLobby() {
        let playersArea = document.getElementById("playersArea");
        let playersList = "";
        for(let i = 0; i < this.mPlayers.length; i +=1) {
            let player = this.mPlayers[i];
            playersList += "";
            if(player.getIsLocal() == true) {
                playersList += '<span class="localPlayer">';
                document.title = player.getName() + " - Mascarade";
            }
            else {
                playersList += '<span class="remotePlayer">';
            }
            playersList += player.getId() + " : " + player.getName() + " ";                       
            playersList += '</span>';
            if(player.getIsReady()) {            
                if(player.getIsLocal() == true) {
                    playersList += '<button id="readyButton" type="button">Not Ready</button>';
                }
                else {
                    playersList += '<span class="remotePlayer">';
                    playersList += 'Ready';
                    playersList += '</span>';
                }
            }
            else {
                if(player.getIsLocal() == true) {
                    playersList += '<input type="text" id="nameEdit" value = "' + player.getName() + '" /><button id="nameUpdateButton" type="button">Update</button><button id="readyButton" type="button">Ready</button>';
                }
                else {
                    playersList += '<span class="remotePlayer">';
                    playersList += 'Not Ready';
                    playersList += '</span>';
                }

            }
            playersList += "<br/>";

        }
        playersArea.innerHTML = playersList;
        let nameUpdateButton = document.getElementById("nameUpdateButton");
        if(nameUpdateButton != null) {
            nameUpdateButton.addEventListener("click", this.updateName.bind(this), false);
        }
        let readyButton = document.getElementById("readyButton");
        if(readyButton != null) {
            readyButton.addEventListener("click", this.toggleReady.bind(this), false);
        }
    }
    updatePlayersAreaShowCards() {
        let playersArea = document.getElementById("playersArea");
        let playersList = "";
        for(let i = 0; i < this.mPlayers.length; i +=1) {
            let player = this.mPlayers[i];
            playersList += "";
            if(player.getIsLocal() == true) {
                playersList += '<span class="localPlayer">';
                document.title = player.getName() + " - Mascarade";
            }
            else {
                playersList += '<span class="remotePlayer">';
            }
            playersList += player.getId() + " : " + player.getName() + " ";
            if(!player.getIsPlaceHolder()) {
                playersList += " : " + player.getCoins() + " ";
            }
            if(player.getCard() != null) {
                if(player.getCard().isHidden()) {
                    playersList += " - " + "Card is Face Down" + " ";
                }
                else {
                    playersList += " - " + player.getCard().getName() + " ";
                }
            }
            playersList += '</span>';
            if(player.getIsReady()) {            
                if(player.getIsLocal() == true) {
                    playersList += '<button id="readyButton" type="button">Not Ready</button>';
                }
                else {
                    playersList += '<span class="remotePlayer">';
                    playersList += 'Ready';
                    playersList += '</span>';
                }
            }
            else {
                if(player.getIsLocal() == true) {
                    playersList += '<button id="readyButton" type="button">Ready</button>';
                }
                else {
                    playersList += '<span class="remotePlayer">';
                    playersList += 'Not Ready';
                    playersList += '</span>';
                    
                }

            }
            

            playersList += "<br/>";

        }
        playersArea.innerHTML = playersList;
        let readyButton = document.getElementById("readyButton");
        if(readyButton != null) {
            readyButton.addEventListener("click", this.toggleReady.bind(this), false);
        }
    }
    updatePlayersAreaShowResolution() {
        let playersArea = document.getElementById("playersArea");
        let playersList = "";
        for(let i = 0; i < this.mPlayers.length; i +=1) {
            let player = this.mPlayers[i];
            playersList += "";
            if(player.getIsLocal() == true) {
                playersList += '<span class="localPlayer">';
                document.title = player.getName() + " - Mascarade";
            }
            else {
                playersList += '<span class="remotePlayer">';
            }
            playersList += player.getId() + " : " + player.getName() + " ";
            if(!player.getIsPlaceHolder()) {
                playersList += " : " + player.getCoins() + " ";
            }
            
            playersList += '</span>';
            if(player.getIsReady()) {            
                if(player.getIsLocal() == true) {
                    playersList += '<button id="readyButton" type="button">Not Ready</button>';
                }
                else {
                    playersList += '<span class="remotePlayer">';
                    playersList += 'Ready';
                    playersList += '</span>';
                }
            }
            else {
                if(player.getIsLocal() == true) {
                    playersList += '<button id="readyButton" type="button">Ready</button>';
                }
                else {
                    playersList += '<span class="remotePlayer">';
                    playersList += 'Not Ready';
                    playersList += '</span>';
                    
                }

            }        

            playersList += "<br/>";
        }
        playersList += "<br/>";
        playersList += '<span class="remotePlayer">The Courthouse has ' + this.getCourthouseCoins() + ' coins.';
        playersArea.innerHTML = playersList;
        let readyButton = document.getElementById("readyButton");
        if(readyButton != null) {
            readyButton.addEventListener("click", this.toggleReady.bind(this), false);
        }
    }
    updatePlayersAreaShowGameOver() {
        let playersArea = document.getElementById("playersArea");
        let playersList = "";
        for(let i = 0; i < this.mPlayers.length; i +=1) {
            let player = this.mPlayers[i];
            playersList += "";
            if(player.getIsLocal() == true) {
                playersList += '<span class="localPlayer">';
                document.title = player.getName() + " - Mascarade";
            }
            else {
                playersList += '<span class="remotePlayer">';
            }
            playersList += player.getId() + " : " + player.getName() + " ";
            if(!player.getIsPlaceHolder()) {
                playersList += " : " + player.getCoins() + " ";
            }
            if(player.getCard() != null) {
                if(player.getCard().isHidden()) {
                    playersList += " - " + "Card is Face Down" + " ";
                }
                else {
                    playersList += " - " + player.getCard().getName() + " ";
                }
            }
            playersList += '</span>';
            if(player.getIsReady()) {            
                if(player.getIsLocal() == true) {
                    playersList += '<button id="readyButton" type="button">Not Ready</button>';
                }
                else {
                    playersList += '<span class="remotePlayer">';
                    playersList += 'Ready';
                    playersList += '</span>';
                }
            }
            else {
                if(player.getIsLocal() == true) {
                    playersList += '<button id="readyButton" type="button">Ready</button>';
                }
                else {
                    playersList += '<span class="remotePlayer">';
                    playersList += 'Not Ready';
                    playersList += '</span>';
                    
                }

            }
            

            playersList += "<br/>";
        }
        playersList += "<br/>";
            playersList += '<span class="remotePlayer">The Courthouse has ' + this.getCourthouseCoins() + ' coins.';
        playersArea.innerHTML = playersList;
        let readyButton = document.getElementById("readyButton");
        if(readyButton != null) {
            readyButton.addEventListener("click", this.toggleReady.bind(this), false);
        }
    }
    /* updatePlayersArea() {
        let playersArea = document.getElementById("playersArea");
        let playersList = "";
        for(let i = 0; i < this.mPlayers.length; i +=1) {
            let player = this.mPlayers[i];
            playersList += "";
            if(player.getIsLocal() == true) {
                playersList += '<span class="localPlayer">';
                document.title = player.getName() + " - Mascarade";
            }
            else {
                playersList += '<span class="remotePlayer">';
            }
            playersList += player.getId() + " : " + player.getName() + " ";
            if(!player.getIsPlaceHolder()) {
                playersList += " : " + player.getCoins() + " ";
            }
            playersList += '</span>';
            playersList += "<br/>";
        }
        playersList += "<br/>";
        playersList += '<span class="remotePlayer">The Courthouse has ' + this.getCourthouseCoins() + ' coins.';
        playersArea.innerHTML = playersList;
        
    } */
    updatePlayersArea() {
        let playersArea = document.getElementById("playersArea");
        let playersList = "";
        for(let i = 0; i < this.mPlayers.length; i +=1) {
            let player = this.mPlayers[i];
            playersList += "";
            if(player.getIsLocal() == true) {
                playersList += '<span class="localPlayer">';
                document.title = player.getName() + " - Mascarade";
            }
            else {
                playersList += '<span class="remotePlayer">';
            }
            if(this.getShowId()) {
                playersList += player.getId() + " : ";
            }
            playersList += player.getName() + " ";   
            if(this.getShowCoins()) { 
                if(!player.getIsPlaceHolder()) {
                    playersList += " : " + player.getCoins() + " ";
                }
            }
            if(this.getShowCards()) {
                if(player.getCard() != null) {
                    if(player.getCard() != null) {                        
                        playersList += " - " + player.getCard().getName() + " ";
                    }
                }                   
            }
            playersList += '</span>';
            if(this.getShowReady()) {
                if(player.getIsReady()) {            
                    if(player.getIsLocal() == true) {
                        playersList += '<button id="readyButton" type="button">Not Ready</button>';
                    }
                    else {
                        playersList += '<span class="remotePlayer">';
                        playersList += 'Ready';
                        playersList += '</span>';
                    }
                }
                else {
                    if(player.getIsLocal() == true) {
                        if(this.getShowUpdate()) {
                            playersList += '<input type="text" id="nameEdit" value = "' + player.getName() + '" /><button id="nameUpdateButton" type="button">Update</button>';
                        }
                        playersList += '<button id="readyButton" type="button">Ready</button>';
                    }
                    else {
                        playersList += '<span class="remotePlayer">';
                        playersList += 'Not Ready';
                        playersList += '</span>';
                    }

                }
            }
            playersList += "<br/>";

        }
        playersList += '<br/><span class="remotePlayer">The Courthouse has ' + this.getCourthouseCoins() + ' coins.';
        playersArea.innerHTML = playersList;
        let nameUpdateButton = document.getElementById("nameUpdateButton");
        if(nameUpdateButton != null) {
            nameUpdateButton.addEventListener("click", this.updateName.bind(this), false);
        }
        let readyButton = document.getElementById("readyButton");
        if(readyButton != null) {
            readyButton.addEventListener("click", this.toggleReady.bind(this), false);
        }
        
    }
    toggleReady(event) {
        console.log("readyButton pressed");
        if(event.target.innerText == "Ready") {
            this.mSocket.emit(this.mReadyReplyMessage);
        }
        else {
            this.mSocket.emit("player not ready");
        }
    }    

    // New player
    onNewGame(data) {
        console.log("New game started: ");
        this.mLocalPlayer = null;
        this.mPlayers = [];
        this.mSocket.emit("new player", {});
    };


    // New player
    onNewPlayerId(data) {
        console.log("New player id from server: " + data.id + ', ' + data.colour + ', ' + data.name + ', ' + data.isLocal);
        this.mLocalPlayer = new Player(data.id, data.colour, data.name, true);
        document.title = newName + " - Mascarade";
        this.mPlayers.push(this.mLocalPlayer);
        this.updatePlayersArea();
    };

   

    // Remove player
    onRemovePlayer(data) {
        var removePlayer = this.getPlayerById(data.id);
        // Player not found
        if (!removePlayer) {
            console.log("Player not found: " + data.id);
            return;
        };

        // Remove player from array
        this.mPlayers.splice(this.mPlayers.indexOf(removePlayer), 1);

        this.updatePlayersArea();
    };

    updateName() {        
        let nameEdit = document.getElementById("nameEdit");
        let newName = nameEdit.value;
        document.title = newName + " - Mascarade";
        //this.mLocalPlayer.setName(newName);
      //  this.updatePlayersArea();

        this.mSocket.emit("name update", newName);
        console.log("name update");
    }

    startGame() {
        this.mSocket.emit("start game", {});
    }

    hideCards() {
        this.mSocket.emit("hide cards", {});
    }

    showCards() {
        this.mSocket.emit("show cards", {});
    }

    onDealCard(data) {
        let card = new Card(data.card);
        let player = this.getPlayerById(data.id);
        player.setCard(card);
        this.updatePlayersArea();
        console.log("deal card");
    }

    onHideCards(data) {
        console.log("hiding cards");
        for(let i = 0; i < this.mPlayers.length; i +=1) {
            let player = this.mPlayers[i];
            player.hideCard();
        }
        this.updatePlayersArea();
    }
    onShowCards(data) {
        console.log("showing cards");
        for(let i = 0; i < this.mPlayers.length; i +=1) {
            let player = this.mPlayers[i];
            player.showCard();
        }
        this.updatePlayersArea();
    }
    onYourTurn(pData) {
        let turnInformationArea = document.getElementById("turnInformation");
        let turnInformationContent = '<h3>Turn Information</h3><br/>';
        turnInformationContent += '<h4>It\'s your turn, what do you want to do?</h4><br/>';
        for(let i = 0; i < pData.turnOptions.length; i+= 1) {
            let turnOption = pData.turnOptions[i];
            turnInformationContent += '<button id="' + turnOption.id + 'Button" type="button">' + turnOption.text + '</button>';
        }

        turnInformationArea.innerHTML = turnInformationContent;
        let lookAtCardButton = document.getElementById("lookAtCardButton");
        if(lookAtCardButton != null) {
            lookAtCardButton.addEventListener("click", this.lookAtCard.bind(this), false);
        }
        let swapOrNotButton = document.getElementById("swapOrNotButton");
        if(swapOrNotButton != null) {
            swapOrNotButton.addEventListener("click", this.swapOrNot.bind(this), false);
        }
        let makeAClaimButton = document.getElementById("makeAClaimButton");
        if(makeAClaimButton != null) {
            makeAClaimButton.addEventListener("click", this.makeAClaim.bind(this), false);
        }

    }
    lookAtCard() {
        this.mSocket.emit("turn choice made", {choice: "lookAtCard"});
    }
    lookAtCardResult(pData) {
        let card = pData.card;
        let turnInformationArea = document.getElementById("turnInformation");
        let turnInformationContent = '<h3>Turn Information</h3><br/>';
        turnInformationContent += '<h4>Your card is: ' + card + '</h4><br/>';
        turnInformationContent += '<button id="endTurnButton" type="button">End Turn</button>';

        turnInformationArea.innerHTML = turnInformationContent;
        let endTurnButton = document.getElementById("endTurnButton");
        if(endTurnButton != null) {
            endTurnButton.addEventListener("click", this.endTurn.bind(this), false);
        }
    }
    makeAClaimResult(pData) {
        let claimOptions = pData.claimOptions;
        let turnInformationArea = document.getElementById("turnInformation");
        let turnInformationContent = '<h3>Turn Information</h3><br/>';
        turnInformationContent += '<h4>I am the:</h4><br/>';
        for(let i = 0; i < claimOptions.length; i +=1) {
            let claimOption = claimOptions[i];
            turnInformationContent += '<button id="'+ claimOption + 'Button" type="button">' + claimOption + '</button>';
        }
        turnInformationArea.innerHTML = turnInformationContent;
        for(let i = 0; i < claimOptions.length; i +=1) {
            let claimOption = claimOptions[i];
            let buttonId = claimOption + "Button";
            let claimButton = document.getElementById(buttonId);
            if(claimButton != null) {
                claimButton.addEventListener("click", this.sendClaim.bind(this, claimOption), false);
            }
        }
    }
    hearingClaims(pData){
        let turnInformationArea = document.getElementById("turnInformation");
        let turnInformationContent = '<h3>Turn Information</h3><br/>';
        turnInformationContent += '<h4>The following people are claiming to be the ' + pData.claimOption + ': </h4><br/>';
        for(let i = 0; i < pData.claims.length; i += 1) {
            let claim = pData.claims[i];
            turnInformationContent += '<h4>' + claim + '</h4><br/>';
        }
        turnInformationContent += '<h4>' + pData.player + ' is deciding how to respond.</h4><br/>';
        turnInformationArea.innerHTML = turnInformationContent;
    }
    respondToClaim(pData) {
        let turnInformationArea = document.getElementById("turnInformation");
        let turnInformationContent = '<h3>Turn Information</h3><br/>';
        turnInformationContent += '<h4>The following people are claiming to be the ' + pData.claimOption + ': </h4><br/>';
        for(let i = 0; i < pData.claims.length; i += 1) {
            let claim = pData.claims[i];
            turnInformationContent += '<h4>' + claim + '</h4><br/>';
        }
        turnInformationContent += '<h4>How do you respond?</h4><br/>';
        turnInformationContent += '<button id="counterClaimButton" type="button">No, I am the ' + pData.claimOption + '!</button>';
        turnInformationContent += '<button id="keepQuietButton" type="button">Keep Quiet</button>';
        turnInformationArea.innerHTML = turnInformationContent;
        let counterClaimButton = document.getElementById("counterClaimButton");
        if(counterClaimButton != null) {
            counterClaimButton.addEventListener("click", this.sendCounterClaim.bind(this), false);
        }
        let keepQuietButton = document.getElementById("keepQuietButton");
        if(keepQuietButton != null) {
            keepQuietButton.addEventListener("click", this.sendKeepQuiet.bind(this), false);
        }
    }
    sendClaim(pClaimOption) {
        console.log("I am the " + pClaimOption);
        this.mSocket.emit("turn choice made", {choice: "madeAClaim", claimOption: pClaimOption});
    }
    sendCounterClaim(pClaimOption) {
        this.mSocket.emit("turn choice made", {choice: "madeACounterClaim"});
    }
    sendKeepQuiet() {
        this.mSocket.emit("turn choice made", {choice: "keptQuiet"});
    }
    endTurn() {
        this.mSocket.emit("end turn", {});
    }
    swapOrNot() {
        this.mSocket.emit("turn choice made", {choice: "swapOrNot"});
    }
    swapOrNotResult(pData) {
        let players = pData.players;
        let turnInformationArea = document.getElementById("turnInformation");
        let turnInformationContent = '<h3>Turn Information</h3><br/>';
        turnInformationContent += '<h4>Choose a player to swap or not with.</h4><br/>';
        for(let i = 0; i < players.length; i +=1) {
            let player = players[i];
            turnInformationContent += '<button id="'+ player.id + 'Button" type="button">' + player.name + '</button>';
        }
        turnInformationArea.innerHTML = turnInformationContent;
        for(let i = 0; i < players.length; i +=1) {
            let player = players[i];
            let buttonId = player.id + "Button";
            let swapButton = document.getElementById(buttonId);
            if(swapButton != null) {
                swapButton.addEventListener("click", this.swapWith.bind(this, player.id), false);
            }
        }
    }
    swapOrNotChoice(pData) {
        let turnInformationArea = document.getElementById("turnInformation");
        let turnInformationContent = '<h3>Turn Information</h3><br/>';
        turnInformationContent += '<h4>Choose whether to swap or not with ' + pData.playerName + '.</h4><br/>';
        turnInformationContent += '<button id="swapButton" type="button">Swap</button>';
        turnInformationContent += '<button id="notButton" type="button">Not</button>';
        turnInformationArea.innerHTML = turnInformationContent;
        let swapButton = document.getElementById("swapButton");
        if(swapButton != null) {
            swapButton.addEventListener("click", this.swapWithChoice.bind(this, pData.playerid), false);
        }
        let notButton = document.getElementById("notButton");
        if(notButton != null) {
            notButton.addEventListener("click", this.notWithChoice.bind(this, pData.playerid), false);
        }
    }
    swapWith(pPlayerId) {
        this.mSocket.emit("turn choice made", {choice: "swapOrNotPlayerChosen", playerid: pPlayerId});
    }
    swapWithChoice(pPlayerId) {
        this.mSocket.emit("turn choice made", {choice: "swapWithPlayerChosen", playerid: pPlayerId});
    }
    notWithChoice(pPlayerId) {
        this.mSocket.emit("turn choice made", {choice: "notWithPlayerChosen", playerid: pPlayerId});
    }
    makeAClaim() {
        this.mSocket.emit("turn choice made", {choice: "makeAClaim"});
    }
    onOtherTurn(pData) {
        let turnInformationArea = document.getElementById("turnInformation");
        let turnInformationContent = '<h3>Turn Information</h3><br/>';
        let playerName = pData.playerName;
        turnInformationContent += '<h4>It\'s ' + playerName + '\'s turn. ' + pData.message + '</h4><br/>';
        

        turnInformationArea.innerHTML = turnInformationContent;
    }
    setCourthouseCoins(pCourthouseCoins) {
        this.mCourthouseCoins = pCourthouseCoins;
    }
    getCourthouseCoins() {
        return this.mCourthouseCoins;
    }
    onUpdatePlayers(data) {
        console.log("received player update from server");
        this.mPlayers = [];
        let dataPlayers = data.players;
        this.mReadyReplyMessage = data.readyReplyMessage;
        this.setCourthouseCoins(data.courthouseCoins);
        this.setShowId(data.showId);
        this.setShowCoins(data.showCoins);
        this.setShowCards(data.showCards);
        this.setShowCourthouse(data.showCourthouse);
        this.setShowUpdate(data.showUpdate);
        this.setShowReady(data.showReady);
        for(let i = 0; i < dataPlayers.length; i +=1) {
            let playerObject = dataPlayers[i];
            let player = new Player(playerObject.id, playerObject.colour, playerObject.name, playerObject.isLocal, playerObject.isPlaceHolder);
            player.setIsReady(playerObject.isReady);
            player.setCoins(playerObject.coins);
            if(playerObject.card != "no card yet") {
                let card = new Card(playerObject.card);
                player.setCard(card);
            }
            this.mPlayers.push(player);
        }
        this.updatePlayersArea();/* 
        if(data.isGameStarted) {
            let shouldShowCards = data.shouldShowCards;
            if(shouldShowCards) {            
                this.updatePlayersAreaShowCards();
            }
            else if(data.shouldShowResolution) {
                this.updatePlayersAreaShowResolution();
            }
            else if(data.shouldShowGameOver) {
                this.updatePlayersAreaShowGameOver();
            }
            else {
                this.updatePlayersArea();
            }
        }
        else {
            this.updatePlayersAreaLobby();
        } */
    }
    claimsResolution(pData) {
        console.log("claims resolution");
        let turnInformationArea = document.getElementById("turnInformation");
        let turnInformationContent = '<h3>Turn Information</h3><br/>';
        turnInformationContent += '<h4>' + pData.claimsResolution + '</h4><br/>';
        let falseClaims = pData.falseClaims;
        if(falseClaims.length > 0) {
            turnInformationContent += '<h4>These people made false claims to be the ' + pData.claim + '!</h4><br/>';
        }
        for(let i = 0; i < falseClaims.length; i +=1) {
            let falseClaim = falseClaims[i];
            turnInformationContent += '<h4>' + falseClaim.player + ' is actually the ' + falseClaim.card + '</h4><br/>';
        }
        turnInformationArea.innerHTML = turnInformationContent;
    }
    gameOver(pData) {
        console.log("claims resolution");
        let turnInformationArea = document.getElementById("turnInformation");
        let turnInformationContent = '<h3>Turn Information</h3><br/>';
        turnInformationContent += '<h4>' + pData.claimsResolution + '</h4><br/>';        
        turnInformationArea.innerHTML = turnInformationContent;
    }
    chooseBishopVictim(pData) {
        let victims = pData.victims;
        let turnInformationArea = document.getElementById("turnInformation");
        let turnInformationContent = '<h3>Turn Information</h3><br/>';
        turnInformationContent += '<h4>You are the Bishop. Choose a player to take 2 coins from.</h4><br/>';
        for(let i = 0; i < victims.length; i +=1) {
            let player = victims[i];
            turnInformationContent += '<button id="'+ player.id + 'Button" type="button">' + player.name + '</button>';
        }
        turnInformationArea.innerHTML = turnInformationContent;
        for(let i = 0; i < victims.length; i +=1) {
            let player = victims[i];
            let buttonId = player.id + "Button";
            let bishopButton = document.getElementById(buttonId);
            if(bishopButton != null) {
                bishopButton.addEventListener("click", this.bishopVictim.bind(this, player.id), false);
            }
        }
    }
    bishopVictim(pVictimId) {
        this.mSocket.emit("bishop victim chosen", {id: pVictimId});
    }
    chooseWitchVictim(pData) {
        let victims = pData.victims;
        let turnInformationArea = document.getElementById("turnInformation");
        let turnInformationContent = '<h3>Turn Information</h3><br/>';
        turnInformationContent += '<h4>You are the Witch. Choose a player to swap fortunes with.</h4><br/>';
        for(let i = 0; i < victims.length; i +=1) {
            let player = victims[i];
            turnInformationContent += '<button id="'+ player.id + 'Button" type="button">' + player.name + '</button>';
        }
        turnInformationArea.innerHTML = turnInformationContent;
        for(let i = 0; i < victims.length; i +=1) {
            let player = victims[i];
            let buttonId = player.id + "Button";
            let witchButton = document.getElementById(buttonId);
            if(witchButton != null) {
                witchButton.addEventListener("click", this.witchVictim.bind(this, player.id), false);
            }
        }
    }
    witchVictim(pVictimId) {
        this.mSocket.emit("witch victim chosen", {id: pVictimId});
    }

    chooseFoolVictims(pData) {
        let victims = pData.victims;
        let word = "first";
        if(this.getFirstVictim() != null) {
            word = "second";
        }
        let turnInformationArea = document.getElementById("turnInformation");
        let turnInformationContent = '<h3>Turn Information</h3><br/>';
        turnInformationContent += '<h4>You are the Fool. Choose ' + word + ' player to swap or not.</h4><br/>';
        for(let i = 0; i < victims.length; i +=1) {
            let player = victims[i];
            turnInformationContent += '<button id="'+ player.id + 'Button" type="button">' + player.name + '</button>';
        }
        turnInformationArea.innerHTML = turnInformationContent;
        for(let i = 0; i < victims.length; i +=1) {
            let player = victims[i];
            let buttonId = player.id + "Button";
            let foolButton = document.getElementById(buttonId);
            if(foolButton != null) {
                foolButton.addEventListener("click", this.foolVictims.bind(this, player.id, pData), false);
            }
        }
    }
    foolVictims(pVictimId, pData) {
        if(this.getFirstVictim() == null) {
            this.setFirstVictim(pVictimId);
            this.chooseFoolVictims(pData);
        }
        else {
            let firstVictim = this.getFirstVictim();
            this.setFirstVictim(null);
            this.mSocket.emit("fool victims chosen", {id1: firstVictim, id2: pVictimId});
        }
    }
    foolSwapOrNotChoice(pData) {
        let turnInformationArea = document.getElementById("turnInformation");
        let turnInformationContent = '<h3>Turn Information</h3><br/>';
        turnInformationContent += '<h4>You are the Fool. Choose whether to swap ' + pData.victim1 + ' or not with ' + pData.victim2 + '.</h4><br/>';
        turnInformationContent += '<button id="swapButton" type="button">Swap</button>';
        turnInformationContent += '<button id="notButton" type="button">Not</button>';
        turnInformationArea.innerHTML = turnInformationContent;
        let swapButton = document.getElementById("swapButton");
        if(swapButton != null) {
            swapButton.addEventListener("click", this.foolSwapWithChoice.bind(this, pData), false);
        }
        let notButton = document.getElementById("notButton");
        if(notButton != null) {
            notButton.addEventListener("click", this.foolNotWithChoice.bind(this, pData), false);
        }
    }
    foolSwapWithChoice(pData) {
        this.mSocket.emit("fool swap chosen", pData);
    }
    foolNotWithChoice(pData) {
        this.mSocket.emit("fool not chosen", pData);
    }
    chooseSpyVictim(pData) {
        let victims = pData.victims;
        let turnInformationArea = document.getElementById("turnInformation");
        let turnInformationContent = '<h3>Turn Information</h3><br/>';
        turnInformationContent += '<h4>You are the Spy. Choose a player to see their card, and maybe swap with yours.</h4><br/>';
        for(let i = 0; i < victims.length; i +=1) {
            let player = victims[i];
            turnInformationContent += '<button id="'+ player.id + 'Button" type="button">' + player.name + '</button>';
        }
        turnInformationArea.innerHTML = turnInformationContent;
        for(let i = 0; i < victims.length; i +=1) {
            let player = victims[i];
            let buttonId = player.id + "Button";
            let spyButton = document.getElementById(buttonId);
            if(spyButton != null) {
                spyButton.addEventListener("click", this.spyVictim.bind(this, player.id), false);
            }
        }
    }
    spyVictim(pVictimId) {
        this.mSocket.emit("spy victim chosen", {id: pVictimId});
    }
    spySwapOrNotChoice(pData) {
        let turnInformationArea = document.getElementById("turnInformation");
        let turnInformationContent = '<h3>Turn Information</h3><br/>';
        turnInformationContent += '<h4>You are the' + pData.playerCard + '. Choose whether to swap or not with ' + pData.victimName + ' the ' + pData.victimCard + '.</h4><br/>';
        turnInformationContent += '<button id="swapButton" type="button">Swap</button>';
        turnInformationContent += '<button id="notButton" type="button">Not</button>';
        turnInformationArea.innerHTML = turnInformationContent;
        let swapButton = document.getElementById("swapButton");
        if(swapButton != null) {
            swapButton.addEventListener("click", this.spySwapWithChoice.bind(this, pData), false);
        }
        let notButton = document.getElementById("notButton");
        if(notButton != null) {
            notButton.addEventListener("click", this.spyNotWithChoice.bind(this, pData), false);
        }
    }
    spySwapWithChoice(pData) {
        this.mSocket.emit("spy swap chosen", pData);
    }
    spyNotWithChoice(pData) {
        this.mSocket.emit("spy not chosen", pData);
    }
    chooseInquisitorVictim(pData) {
        let victims = pData.victims;
        let turnInformationArea = document.getElementById("turnInformation");
        let turnInformationContent = '<h3>Turn Information</h3><br/>';
        turnInformationContent += '<h4>You are the Inquisitor. Choose a player to demand a guess from.</h4><br/>';
        for(let i = 0; i < victims.length; i +=1) {
            let player = victims[i];
            turnInformationContent += '<button id="'+ player.id + 'Button" type="button">' + player.name + '</button>';
        }
        turnInformationArea.innerHTML = turnInformationContent;
        for(let i = 0; i < victims.length; i +=1) {
            let player = victims[i];
            let buttonId = player.id + "Button";
            let inquisitorButton = document.getElementById(buttonId);
            if(inquisitorButton != null) {
                inquisitorButton.addEventListener("click", this.inquisitorVictim.bind(this, player.id), false);
            }
        }
    }
    inquisitorVictim(pVictimId) {
        this.mSocket.emit("inquisitor victim chosen", {id: pVictimId});
    }
    makeAGuess(pData) {
        let claimOptions = pData.claimOptions;
        let turnInformationArea = document.getElementById("turnInformation");
        let turnInformationContent = '<h3>Turn Information</h3><br/>';
        turnInformationContent += '<h4>I am the:</h4><br/>';
        for(let i = 0; i < claimOptions.length; i +=1) {
            let claimOption = claimOptions[i];
            turnInformationContent += '<button id="'+ claimOption + 'Button" type="button">' + claimOption + '</button>';
        }
        turnInformationArea.innerHTML = turnInformationContent;
        for(let i = 0; i < claimOptions.length; i +=1) {
            let claimOption = claimOptions[i];
            let buttonId = claimOption + "Button";
            let claimButton = document.getElementById(buttonId);
            if(claimButton != null) {
                claimButton.addEventListener("click", this.sendGuess.bind(this, claimOption), false);
            }
        }
    }
    sendGuess(pClaimOption) {
        console.log("I am the " + pClaimOption);
        this.mSocket.emit("inquisitor made a guess", pClaimOption);
    }
    setEventHandlers() {
        

        

        /* this.mMainCanvas.addEventListener("touchstart", this.onTouchStart.bind(this), false);
        this.mMainCanvas.addEventListener("touchmove", this.onTouchMove.bind(this), false);
        this.mMainCanvas.addEventListener("touchend", this.onTouchEnd.bind(this), false);
        this.mMainCanvas.addEventListener("touchcancel", this.onTouchCancel.bind(this), false);

        this.mMainCanvas.addEventListener("mouseup", this.onMouseUp.bind(this), false);
        this.mMainCanvas.addEventListener("mousedown", this.onMouseDown.bind(this), false);
        this.mMainCanvas.addEventListener("mousemove", this.onMouseMove.bind(this), false);
        this.mMainCanvas.addEventListener("mousewheel", this.onMouseWheel.bind(this), false);

        

        // Window resize
        window.addEventListener("resize", this.resizeCanvas.bind(this), false); */

        if (this.mSocket) {
            // Socket connection successful
            this.mSocket.on("connect", this.onSocketConnected.bind(this));

            // Socket disconnection
            this.mSocket.on("disconnect", this.onSocketDisconnect.bind(this));

            // New player message received
            this.mSocket.on("new player", this.onNewPlayer.bind(this));

            // New player message received
            this.mSocket.on("new player id", this.onNewPlayerId.bind(this));
            this.mSocket.on("name update", this.onNewPlayerName.bind(this));

            
            // Player removed message received
            this.mSocket.on("remove player", this.onRemovePlayer.bind(this));

            this.mSocket.on("new game", this.onNewGame.bind(this));

            this.mSocket.on("deal card", this.onDealCard.bind(this));
            this.mSocket.on("hide cards", this.onHideCards.bind(this));
            this.mSocket.on("show cards", this.onShowCards.bind(this));

            this.mSocket.on("update players", this.onUpdatePlayers.bind(this));
            this.mSocket.on("your turn", this.onYourTurn.bind(this));
            this.mSocket.on("other turn", this.onOtherTurn.bind(this));

            this.mSocket.on("look at card", this.lookAtCardResult.bind(this));

            this.mSocket.on("swap or not", this.swapOrNotResult.bind(this));
            this.mSocket.on("swap or not result", this.swapOrNotChoice.bind(this));

            this.mSocket.on("make a claim", this.makeAClaimResult.bind(this));

            this.mSocket.on("hearing claims", this.hearingClaims.bind(this));
            this.mSocket.on("respond to claim", this.respondToClaim.bind(this));

            this.mSocket.on("choose bishop victim", this.chooseBishopVictim.bind(this));
            this.mSocket.on("choose witch victim", this.chooseWitchVictim.bind(this));
            this.mSocket.on("choose fool victims", this.chooseFoolVictims.bind(this));
            this.mSocket.on("fool swap or not result", this.foolSwapOrNotChoice.bind(this));
            this.mSocket.on("choose spy victim", this.chooseSpyVictim.bind(this));
            this.mSocket.on("spy swap or not result", this.spySwapOrNotChoice.bind(this));
            this.mSocket.on("choose inquisitor victim", this.chooseInquisitorVictim.bind(this));
            this.mSocket.on("make a guess", this.makeAGuess.bind(this));
            this.mSocket.on("game already started", this.onJoinRejected.bind(this));

            this.mSocket.on("claims resolution", this.claimsResolution.bind(this));
            
            this.mSocket.on("game over", this.gameOver.bind(this));
        }
    };
    getPlayerById(pId) {
        var i, player;
        player = null;
        if (this.mLocalPlayer.getId() == pId) {
            player = this.mLocalPlayer;
        } else {
            for (i = 0; i < this.mPlayers.length; i++) {
                if (this.mPlayers[i].getId() == pId) {
                    player = this.mPlayers[i];
                    break;
                }
            }
        }
        return player;
    };
}