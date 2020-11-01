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
            }
            else {
                playersList += '<span class="remotePlayer">';
            }
            playersList += player.getId() + " : " + player.getName() + " ";
            playersList += " : " + player.getCoins() + " ";
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
    updatePlayersArea() {
        let playersArea = document.getElementById("playersArea");
        let playersList = "";
        for(let i = 0; i < this.mPlayers.length; i +=1) {
            let player = this.mPlayers[i];
            playersList += "";
            if(player.getIsLocal() == true) {
                playersList += '<span class="localPlayer">';
            }
            else {
                playersList += '<span class="remotePlayer">';
            }
            playersList += player.getId() + " : " + player.getName() + " ";
            playersList += " : " + player.getCoins() + " ";
            playersList += '</span>';
            playersList += "<br/>";

        }
        playersArea.innerHTML = playersList;
        
    }
    toggleReady(event) {
        console.log("readyButton pressed");
        if(event.target.innerText == "Ready") {
            this.mSocket.emit("player ready");
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
        document.title = data.id;
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

    onUpdatePlayers(data) {
        console.log("received player update from server");
        this.mPlayers = [];
        let dataPlayers = data.players;
        for(let i = 0; i < dataPlayers.length; i +=1) {
            let playerObject = dataPlayers[i];
            let player = new Player(playerObject.id, playerObject.colour, playerObject.name, playerObject.isLocal, playerObject.isPlaceHolder);
            player.setIsReady(playerObject.isReady);
            if(playerObject.card != "no card yet") {
                let card = new Card(playerObject.card);
                player.setCard(card);
            }
            this.mPlayers.push(player);
        }
        if(data.isGameStarted) {
            let shouldShowCards = data.shouldShowCards;
            if(shouldShowCards) {            
                this.updatePlayersAreaShowCards();
            }
            else {
                this.updatePlayersArea();
            }
        }
        else {
            this.updatePlayersAreaLobby();
        }
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

            this.mSocket.on("game already started", this.onJoinRejected.bind(this));
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