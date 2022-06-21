const path          = require('path');
const http          = require('http');
const express       = require('express');
const socketIO      = require('socket.io')(server, {serveClient: false});

const publicPath    = path.join(__dirname, '/../public');

const port          = process.env.PORT || 3000;

let app             = express();

let server          = http.createServer(app);

let io              = socketIO(server);

Player = require("../public/js/player").Player;	// Player class
ServerPlayer = require("./serverPlayer").ServerPlayer;	// Player class
Vector = require("../public/js/vector").Vector;	// Vector class
Matrix = require("../public/js/matrix").Matrix;	// Matrix class
Text = require("../public/js/text").Text;	// Text class
Deck = require("../public/js/deck").Deck;	// Deck class
Card = require("../public/js/card").Card;	// Card class
ServerGame = require("./serverGame").ServerGame;	// ServerGame class
ServerTurn = require("./serverTurn").ServerTurn;	// ServerGame class
Utils = require("./utils").Utils;	// Utils class

app.use(express.static(publicPath));




let serverGame;
init();



function init() {
	server.listen(port, ()=> {
		console.log('Server is up on port ${port}.');
		// Create an empty array to store players
		serverGame = new ServerGame(server);
		// Start listening for events
		setEventHandlers();
	});	
	
	
};

function setEventHandlers() {
	// Socket.IO
	//io.on("connection", onSocketConnection);
	io.on("connection", serverGame.onSocketConnection.bind(serverGame));
	
};




