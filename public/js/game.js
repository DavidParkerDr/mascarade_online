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
            if(player.getCard() != null) {
                if(player.getCard().isHidden()) {
                    playersList += " - " + "Card is Face Down" + " ";
                }
                else {
                    playersList += " - " + player.getCard().getName() + " ";
                }
            }
            playersList += " : " + player.getCoins() + " ";
            playersList += '</span>';
            if(player.getIsLocal() == true) {
                playersList += '<input type="text" id="nameEdit" value = "' + player.getName() + '" /><button id="nameUpdateButton" type="button">Update</button>';
            }
            playersList += "<br/>";

        }
        playersArea.innerHTML = playersList;
        let button = document.getElementById("nameUpdateButton");
        if(button != null) {
            button.addEventListener("click", this.updateName.bind(this), false);
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
        this.mLocalPlayer.setName(newName);
        this.updatePlayersArea();

        this.mSocket.emit("name update", this.mLocalPlayer.toJSON());
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
    
    setEventHandlers() {
        

        let startButton = document.getElementById("startGameButton");
        startButton.addEventListener("click", this.startGame.bind(this), false);
        let hideCardsButton = document.getElementById("hideCardsButton");
        hideCardsButton.addEventListener("click", this.hideCards.bind(this), false);
        let showCardsButton = document.getElementById("showCardsButton");
        showCardsButton.addEventListener("click", this.showCards.bind(this), false);

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