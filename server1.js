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

app.use('/', express.static(__dirname + '/client'));
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

var faceOffCounter = 0;

var players = {};
var usernames = {};

var rooms = [];

var puckSlowCount = 0;
var countHost = 0;
var lastHost = true;

var lastPuckX = 540;
var lastPuckY = 300;

var x1 = 0;
var y1 = 0; 
var x2 = 0; 
var y2 = 0;
var puckX //= 540;
var puckY //= 300;
//var puckDist = 0;


let disconnection = {
    sid : null, //socket id
    delay : null //timeout id
};
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
        else if (Object.keys(players).length > 2){
            socket.broadcast.to(players[socket.id]).emit('disconnecting');
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

            };/*
            players[socket.id].hostCounter = 0;
            players[socket.id].hostArray = [false, false, false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
            false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];

            //console.log(players[socket.id].hostCounter)
            /*
            if (Object.keys(players).length === 1)
                players[socket.id].x = 150;
            else
                players[socket.id].x = 750;*/


            firstUpdate++;
            if(firstUpdate % 1){
                rooms.push(room);
            }

            socket.isInGame = true;
            // Add this socket to the room for the game. A room is an easy way to group sockets, so you can send events to a bunch of sockets easily.
            // A socket can be in many rooms.
            socket.join(rooms[rooms.length - 1]);
            //numOfPlayers++;
        if(Object.keys(players).length < 3){
            if (Object.keys(players).length & 2) {
                players[socket.id].host = false;
                console.log("two players connection and clicked Join Game");

                // Tell the clients that they successfully joined the game.
                io.sockets.emit('join_game_success');
            }
            else
                players[socket.id].host = true;
            console.log("* " + socket.username + " joined a game.");
        }
        else {
            console.log("* " + socket.username + " is already in a game.");
        }
    }
    else{
        delete players[socket.id];
        //io.in(rooms[rooms.length - 1]).emit('remove_player', socket.id);
    }
    });/*
    socket.on('conte', function(m_count){
        console.log("M count is : ", m_count);
    })*/

    socket.on('player_update', function(data){
        var sendData = data;
        var playerId = data[0].id;
        var keys = Object.keys(players);


        if (players[playerId].host === lastHost){
            var adversoryDist = Math.min(((x1 - data[0].puckX)*(x1- data[0].puckX)+(y1 - data[0].puckY)*(y1 - data[0].puckY)),
                ((x2 - data[0].puckX)*(x2- data[0].puckX)+(y2 - data[0].puckY)*(y2 - data[0].puckY)));
            var myDist = Math.min(((data[0].x1 - data[0].puckX)*(data[0].x1- data[0].puckX)+(data[0].y1 - data[0].puckY)*(data[0].y1 - data[0].puckY)),
                ((data[0].x - data[0].puckX)*(data[0].x- data[0].puckX)+(data[0].y - data[0].puckY)*(data[0].y - data[0].puckY)));
            var puckDist = ((data[0].puckX - puckX)*(data[0].puckX - puckX) + (data[0].puckY - puckY)*(data[0].puckY - puckY));
            puckX = data[0].puckX;
            puckY = data[0].puckY;
            if (puckDist < 4)
                puckSlowCount++;
            else
                puckSlowCount = 0;

            if (adversoryDist < myDist){// && faceOffCounter == 0){         //faceOffCounter : if goal has been scored last within last 2 secs
                countHost++;
                if ((countHost > 20) && (puckSlowCount > 12)){
                    countHost = 0;
                    puckSlowCount = 0;
                    lastHost = !players[playerId].host;

/*
                    if (lastHost === )
                        lastHost = false;
                    else
                        lastHost = true;
                    /*
                    keys.forEach(function (key) {
                        if (players[key].host){
                            players[key].host = false;
                        }
                        else
                            players[key].host = true;
                    })*/
                    console.log("first: ", adversoryDist, "second: ", myDist)
                    console.log("puckpace ", puckDist)
                    console.log("swapping!")
                    console.log("Boss : ", lastHost )
                }
            }
            else{
                countHost = 0;
            }
            sendData[0].host = lastHost;
            keys.forEach(function (key) {
                if (playerId != key){
                    socket.broadcast.to(key).emit('player_update', sendData);
                }
            })
        }
        else{
            x1 = data[0].x1;
            y1 = data[0].y1;
            x2 = data[0].x;
            y2 = data[0].y;

            sendData[0].host = lastHost;
            keys.forEach(function (key) {
                if (playerId != key){
                    socket.broadcast.to(key).emit('player_update', sendData);
                }
            })
            //console.log("puckDist ", puckDist)
            //console.log("puckY ", puckY, "sent x: ", data[0].puckX)
            //console.log( "sent y: ", data[0].puckY)
        }

        //console.log(playerId, " hc :  ", players[playerId].hostCounter)
    })

    socket.on('goalScored1', function(puckDist){
        if (faceOffCounter == 0){
            io.in(rooms[rooms.length - 1]).emit('goalScored1', puckDist);
            console.log("goal scored 1 event recieved");
            faceOffCounter++;
        }
    })

    socket.on('goalScored2', function(puckDist){
        if (faceOffCounter == 0){
            io.in(rooms[rooms.length - 1]).emit('goalScored2', puckDist);
            console.log("goal scored 2 event recieved");
            faceOffCounter++;
        }
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
        disconnection.sid = socket.request.sessionID; //grab session id
        disconnection.delay = setTimeout(() => {
            if(socket.isInGame === true){
                delete players[socket.id];
            }
        //set timeout to variable, in case of reconnection

            io.in(rooms[rooms.length - 1]).emit('remove_player', socket.id);
        //emit the disconnection event
        }, 5000);
    });

/*
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
    });*/

});


// How often to send game updates. Faster paced games will require a lower value for emitRate,
// so that updates are sent more often. Do some research and test what works for your game.
var emitRate = 2000;

setInterval(function () {
    if (faceOffCounter > 0)
        faceOffCounter++;
    if (faceOffCounter > 2)
        faceOffCounter = 0;

    var dataToSend = preparePlayersDataToSend();
    //console.log(dataToSend);

    // Send the data to all clients in the room called 'game-room'.
    io.in(rooms[rooms.length - 1]).emit('state_update', dataToSend);
    console.log("interval");
}, emitRate);

function preparePlayersDataToSend() {
    // Prepare the positions of the players, ready to send to all players.
    var dataToSend = [];
    var host = true;
    // 'players' is an object, so get a list of the keys.
    var keys = Object.keys(players);

    keys.forEach(function (key) {
        // Add the position (and ID, so the client knows who is where) to the data to send.
        dataToSend.push({id: key, host});
        console.log("ID : ", key, "HOST :", host)
        host = false;

    });
    return dataToSend;
}
clearInterval();