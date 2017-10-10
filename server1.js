/** Simple, easy, networked multiplayer game template using Socket.io and Phaser.io, with lots of explanations.
 * By Johnathan Fisher http://www.waywardworlds.com @waywardworlds
 *
 *  *   *   *   *   *   *   *   *   *   *   *   *   *   *
 *  *   *   *   How to set up the project   *   *   *   *
 *  *   *   *   *   *   *   *   *   *   *   *   *   *   *
 *
 * First, you need to have NodeJS and NPM installed. That should be fairly easy to do.
 * Open a command-line user interface (CLI), and enter 'node -v', then 'npm -v', which
 * should show the versions of Node and NPM if they are set up correctly, which should
 * output something like 'v5.10.0' and '4.4.4', or whatever version you installed.
 *
 * This project uses the Express.js and Socket.io libraries.
 * Everything that is required should be included in the package.json file. Just navigate to
 * the parent directory of your game, i.e. 'C:\path\to\basic-multiplayer-template' in a CLI
 * and enter 'npm install'.
 * This should go through everything listed in the package.json file and install them from NPM.
 *
 * There should now be a folder in your game directory called 'node_modules'.
 * It will be huge and full of junk and looks like a mess, but that's just how NPM is...
 *
 * This file is Server.js, which is what you should run with Node.
 * Assuming you are still in the directory of your game in the command line, enter
 * 'node server'. That will run this javascript file and set everything up that is in here.
 *
 * Below is the code and how it works.
 * */

// Strict mode helps to prevent the use of weird things that you might do in javascript by accident.
//"use strict";
/*
import PIXI from 'pixi';
import P2 from 'p2';*/

var path = require('path');

// Gathering dependencies. The require(...) bit imports the stuff that was installed through npm.
var express = require('express');
// Create an Express app. Socket.io just sits on top of Express, but Express itself isn't
// used much, unless you want to serve files with it, but that is not recommended.
var app = express();

/*
app.use(express.static('public'));

var favicon = require('serve-favicon');

app.use(favicon(__dirname + 'public/favicon.ico'));*/


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/index.html'));
});
/*
app.get("/", function(req, res){
    res.render("index");
})*/
// Make a new HTTP server from Express. This doesn't get used itself either, unless you want to do stuff with it.
//var server = require('http').Server(app);
// This is where Socket.io is set up. Socket takes in the HTTP server created above, and basically adds it's own
// layer on top of it that is nice and easy to use. 'io' is the Socket.io server object. You could call it
// 'socketIOServer' or something similar if you wish, but all of the documentation for Socket.io uses just 'io'.
//var io = require('socket.io')(server);

var path    = require('path');

//var myModule = require('./p2.js');
//var vel = myModule.Object.create(p2.Body.prototype);

var port = process.env.PORT || 3512

var env = process.env.NODE_ENV || 'production';

/**
var lobbyManager = new (require('./js/LobbyManager.js'))(io);
var roomManager = new (require('./js/RoomManager.js'))(io);
var gameManager = new (require('./js/GameManager.js'))(io, roomManager);*/

// What port and IP address to bind the server to. The port number can be any valid public port number (Google it if not sure).
// The port is used to direct network traffic arriving at your computer to a particular service, in this case
// the HTTP server that was created, so anything arriving on port 3512 will go to the HTTP server.

// There is a chance that the port you want to use is already being occupied by another
// process, so something to watch out for if you can't start the server.

// Your IP address is how other devices on a network find this one. The 127.0.0.1 is known as a loop-back address, or
// otherwise known as 'localhost', which is basically a way for a device to send messages to itself.
var server = app.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    console.info('Server running on  ' + port + '  ' + env);
});


var io = require('socket.io').listen(server);

// Used to manage players in the game. See the slightly more advanced stuff
// after you understand everything else and are done with the basics.
var players = {};

//var numOfPlayers = 0;
/** *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *
 *  *   *   * Some useful stuff you can do with Socket.io   *   *   *   *
 *  *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *
 *
 *  socket.on('event_name', function(optionalData){ ... );  - Adds an event listener to this socket.
 *  io.emit('event_name', optionalData);                    - Sends an event to all sockets.
 *  socket.emit('event_name', optionalData);                - Sends an event to this socket.
 *  socket.broadcast.emit('event_name', optionalData);      - Sends an event to all sockets except this one.
 *  io.in('room-name').emit('event_name', optionalData);    - Sends an event to all sockets that are in the specified room.
 *  socket.join('room-name');                               - Adds a socket to a room.
 *  socket.leave('room-name');                              - Removes a socket from a room.
*/

// A 'socket' it just an object that manages a client's connection to the server. For each client that connects to
// this server, they will get their own socket object. These socket objects are stored internally on the io object,
// and can be accessed manually with 'io.sockets' to get a list of the connected sockets, but you shouldn't really need to.

// The first time a connection is made with a new socket (a client), the 'connection' event is triggered
// on io (the Socket.io server object), and it runs the 'connection' callback function (the 'function(socket){ ... }' part).
// The socket object for the client that connected is sent to the callback, and this allows us to do stuff with that
// socket, such as adding event listeners to that socket, which is what is done below.
//                            v The socket object is passed in automatically by io when a connection is made.
 //   myModule = (
 /*       myModule.SETTINGS = {

            SHOOT : 100,
            FORWARD : 22,
            FORWARD_2 : 5,
            BACKWARD : 3,
            CONTROL_DISTANCE : 0.25,
            ROTATE : 5,
            BRAKE : 0.1,            // 10 % of the speed every frame
            PLAYER_DAMP : 0.4,
            //PLAYER_FRICTON : 0.01,
            PUCK_FRICTION : 0.005,
            PUCK_MASS : 0.00001,
            ACC1_LIMIT : 1.80,
        };


        myModule.goalSeconds = 0;

        myModule.PUCK = Math.pow(2,1)
        myModule.STICK =  Math.pow(2,2)
        myModule.SCENERY = Math.pow(2,3)
        myModule.PLAYER = Math.pow(2,0)

        myModule.goalscored = false;
        myModule.frameCounter = 0;
        myModule.n_hit = false;
        
        myModule.currentScore = [];
        myModule.currentScore[0] = 0;
        myModule.currentScore[1] = 0;

        myModule.Player = function ( x, y, id) {
            var playerShape = new p2.Circle({ radius: 0.15 });
            p2.Body.call(this,{
                position:[x, y],
                mass: 1 ,
            });

            playerShape.collisionGroup = PLAYER;
            playerShape.collisionMask = PLAYER | SCENERY | PUCK;

            this.addShape(playerShape);
            this.controlPlayer = false;

            this.stick = new Stick(x, y-0.3);
            this.stick.collisionResponse = 0;
            world.addBody(this.stick);

            this.constraint = new p2.LockConstraint(this, this.stick);
            world.addConstraint(this.constraint);

            this.stick1 = new Stick(x, y+0.3);

            this.stick1.collisionGroup = STICK;
            this.stick1.collisionMask = PUCK;
            world.addBody(this.stick1);

            this.constraint = new p2.LockConstraint(this, this.stick1);
            world.addConstraint(this.constraint);
        }
        console.log("hei");
        myModule.Player.prototype = Object.create(myModule.Body.prototype);
        myModule.Player.prototype.constructor = myModule.Player;

        myModule.Stick = function(x, y){
            var stickShape = new p2.Box({ width: 0.15, height: 0.27 });
            stickShape.collisionGroup = STICK;
            stickShape.collisionMask = PUCK;
            p2.Body.call(this,{
                position:[x, y],
                mass: 1 ,
            });
            this.addShape(stickShape);
        }
        myModule.Stick.prototype = Object.create(myModule.Body.prototype);
        myModule.Stick.prototype.constructor = myModule.Stick;
   */ 
//console.log(myModule)


io.on('connection', function (socket) {
    console.log("* * * A new connection has been made.");
    // Each socket object (one for each connected client) has an 'id' property,
    // which can be used to uniquely identify each socket connection.
    // Check the command line that was used to start the server to see
    // the id of each socket that connects being printed.
    console.log("* ID of new socket object: " + socket.id);

    // Using the socket object that was passed in, events can be sent to the
    // client that socket belongs to using .emit(...)
    // The socket object on the client (see Boot.js in /client/js) should have event
    // listeners of the event name that you are sending to it, or it won't pick them up.

    // So if the server emits 'super_event', then the client must also be listening
    // for 'super_event', and vice versa for when the client sends events to the server.

    // In this case, an event called 'hello_client' is sent, and the (optional) second
    // parameter is any data you might want to send along with the event.
    socket.emit('hello_client', {crazyString: 'abc123', coolArray: [40, 'beep', true]});
    // Or with no data, just an event.
    socket.emit('how_are_you');
    // An event that the client isn't listening for, so will be ignored when the client receives it.
    socket.emit('anyone_there');

    // You can add your own properties onto the socket object like any other object.
    // Useful if you want to store player data like a score, username, or a flag of
    // whether they are currently in a game.
    socket.username = 'DEFAULT NAME';
    socket.score = 0;
    socket.isInGame = false;

    // Event listeners can be added to this socket. Every time the client sends
    // an event to this server, the server will look to see if the name of that event
    // matches any events that this socket is listening for.

    // In this case, an event listener is being added that will listen for an event
    // called 'change_username', and giving it a callback function to run whenever the
    // event is received. When the client sends this event, they can also pass along data.
    // The data that is sent is automatically passed in to the callback as the first argument.
    socket.on('change_username', function(data) {
        // Update the player's username with the data that they sent from their client.
        // The name of the property that you access on the data object must match how it
        // looks when the client sent it.
        socket.username = data.username;
        console.log("* Username changed to: " + data.username);
    });
    socket.on('player.ready', function() {
        players[socket.id] = socket;
        if (Object.keys(players).length === 2) {
            console.log("two players connection and clicked Join Game");
            io.sockets.emit('players.ready');/*
            var dataToSend = preparePlayersDataToSend();
            io.in('game-room').emit('state_update', dataToSend);*/
        }
    });

    socket.on('im_fine', function (/* No data was sent by the client for this event. You could put 'data' here but it would just be undefined. */) {
        socket.emit('good_to_hear');
    });
    var firstUpdate = 0;

    socket.on('join_game', function () {
        // Check that the player is not already in a game before letting them join one.
        if(socket.isInGame === false){
            // This player is now in a game.
            // Add a basic object that tracks player position to the list of players, using
            // the ID of this socket as the key for convenience, as each socket ID is unique.
            players[socket.id] = { 
  /*              y: 300,
                angle: Math.PI,
                puckX: 450,
                puckY: 300*/

            };
            if (Object.keys(players).length === 1)
                players[socket.id].x = 150;
            else
                players[socket.id].x = 750;


            firstUpdate++;
            socket.isInGame = true;
            // Add this socket to the room for the game. A room is an easy way to group sockets, so you can send events to a bunch of sockets easily.
            // A socket can be in many rooms.
            socket.join('game-room');
            //numOfPlayers++;

            if (Object.keys(players).length === 2) {
                console.log("two players connection and clicked Join Game");

                // Tell the clients that they successfully joined the game.
                io.sockets.emit('join_game_success');
            }
            console.log("* " + socket.username + " joined a game.");
        }
        else {
            console.log("* " + socket.username + " is already in a game.");
        }
    });

    socket.on('player_update', function(data){
        //console.log(data);

        io.in('game-room').emit('player_update', data);//{id: data.id, x: data.x, y: data.y, angle: data.angle, x1: data.x1, y1: data.y1, angle1: data.angle1});
        //console.log(data);


    })
    socket.on('goalScored1', function(){
        io.in('game-room').emit('goalScored1');
        console.log("goal scored 1 event recieved");
    })

    socket.on('goalScored2', function(){
        io.in('game-room').emit('goalScored2');
        console.log("goal scored 2 event recieved");
    })
/*
/*
    socket.on('puckPos', function(data){
        io.in('game-room').emit('puckPos', {x: data.x, y: data.y});
        var keys = Object.keys(players);
    // Loop though the list of players and get the position of each player.
        keys.forEach(function (key) {
            players[key].puckX = data.x;
            players[key].puckY = data.y;
        });*/
        /*puck.target_x = data.x;
        puck.target_y = data.y;*/
        //io.in('game-room').emit('puckPos', {x: data.x, y: data.y});
        //console.log("puckPos : ", data.x, " , ", data.y);
        //console.log("puckPos : ", data.x, " , ", data.y);
    //})

/*
    socket.on('key_pressed', function(data){
        io.in('game-room').emit('key_pressed', {playerId: socket.id, key: data.key ,state:'down', host: data.host});
        console.log("key press received: ", data.key);


        //console.log([socket.id]);

    })*/
/*
    socket.on('key_up', function(data){
        io.in('game-room').emit('key_pressed', {playerId: socket.id, key: data.key, state:'up', host: data.host});
        //console.log("key up received: ", data.key);
    })*/

/*

    socket.on('move_player', function (data) {
        // Access the object in the list of players that has the key of this socket ID.
        // 'data.axis' is the axis to move in, x or y.
        // 'data.force' is which direction on the given axis to move, 1 or -1.
        // So if the axis is 'y', and the force is -1, then the player would move up.
        // Change the * 2 multiplier to change the movement speed.

        players[socket.id][data.axis] += data.force * 2;

        //console.log(players[socket.id][data.axis]);
    });*/
/*
    socket.on('thrust', function(data){
         players[socket.id].x++;
    })*/

    // When a client socket disconnects (closes the page, refreshes, timeout etc.),
    // then this event will automatically be triggered.
    socket.on('disconnecting', function () {
        // Check if this player was in a game before they disconnected.
        if(socket.isInGame === true){
            // Remove this player from the player list.
            delete players[socket.id];
            // This player was in a game and has disconnected, but the other players still in the game don't know that.
            // We need to tell the other players to remove the sprite for this player from their clients.
            // All of the players still in the game are in the room called 'game-room', so emit an event called 'remove_player'
            // to that room, sending with it the key of the property to remove.
            io.in('game-room').emit('remove_player', socket.id);
        }
    });

});


// How often to send game updates. Faster paced games will require a lower value for emitRate,
// so that updates are sent more often. Do some research and test what works for your game.
var emitRate = 8000;

setInterval(function () {


    var dataToSend = preparePlayersDataToSend();
    //console.log(dataToSend);

    // Send the data to all clients in the room called 'game-room'.
    io.in('game-room').emit('state_update', dataToSend);
    console.log("interval");
}, emitRate);

function preparePlayersDataToSend() {
    // Prepare the positions of the players, ready to send to all players.
    var dataToSend = [];
    // 'players' is an object, so get a list of the keys.
    var keys = Object.keys(players);
    // Loop though the list of players and get the position of each player.
    keys.forEach(function (key) {
        // Add the position (and ID, so the client knows who is where) to the data to send.
        dataToSend.push({id: key, x: null, y: null, angle: null, puckX: null, puckY: null});
    });
    return dataToSend;
}
clearInterval();