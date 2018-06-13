 
 

// Global reference to the active Phaser game state. This makes doing things with
// a state possible without actually being in the state file itself.
var _this;
var sizer = 1.2;

var host = true;
var angle, dir;
var isHost = true;
var lastPuckX = 540;
var lastPuckY = 300;
var velX = 0;
var velY = 0;

var puckD;
// Connect to the Socket.io server that is running on the IP address 127.0.0.1 and at port number 3512.
//var socket = io("http://127.0.0.1:3512");
var socket = io();

// This connects to 127.0.0.1 which is localhost (this computer), which is also where the server is running.
// If the server was running somewhere else, like on a cloud service, then change the IP address to the
// public IP address of that device. If on Windows, open a console and type 'ipconfig' to find the IPv4
// address of a computer.

// Add some event listeners to this socket object.
// When the connection is made, the server can send events to this client, and vice versa.
// Open your browser's console to see the output. Follow along with the instructions there.


socket.on('join_game_success', function () {
    console.log("");
    console.log("* * * join_game_success event received from server.");
    console.log("* Starting Game state.");
    // This player joined the game. Start the 'Game' state.
    _this.state.start("Game");
});

socket.on('remove_player', function (data) {
    console.log("");
    console.log("* * * remove_player event received from server.");
    // Check that the 'playerSprites' object exists on whatever the context is for '_this'.
    if(_this.playerSprites !== undefined){
        // Check that the player sprite to remove is actually in the list of player sprites.
        if(_this.playerSprites[data]){
            // Destroy the player sprite for the player to remove.
            _this.playerSprites[data][0].destroy();
            _this.playerSprites[data][1].destroy();
            // Delete the property for that player.
            delete _this.playerSprites[data];
        }
    }
});
socket.on('puckPos', function(data){

/*
    puck.target_x = data.x;
    puck.target_y = data.y;*/
    //console.log(puck.target_y)
});
var emitRate = 1000/180;
var divisor = 3;

socket.on('player_update', function(data){
    //console.log("receiving client data from", data[0].id);
if((_this.playerSprites !== undefined)  || (_this.playerSprites !== null)){

        // The 'playerSprites' object exists.
        for(let i= 0; i<1; i+=1){
                    if(_this.playerSprites[data[i].id].host === data[i].host){

                            isHost = true;
                            _this.puck.body.x = _this.target.body.x;
                            _this.puck.body.y = _this.target.body.y;

                            _this.target.visible = true;
                            _this.puck.visible = false;
                            _this.puck.collides = false;

                    }
                
                    else{

                        if (isHost){

                            _this.puck.body.velocity.x = velX *20;
                            _this.puck.body.velocity.y = velY *20;

                            console.log("velocity ")
                            console.log(_this.target.velocity);
                        }

                        _this.puck.collides = true;
                        _this.target.visible = false;
                        _this.puck.visible = true;
                        isHost = false;
                    }
                _this.playerSprites[data[i].id][0].target_x         = data[i].x; // Update target, not actual position, so we can interpolate
                _this.playerSprites[data[i].id][0].target_y         = data[i].y;
                _this.playerSprites[data[i].id][0].target_rotation  = data[i].angle;
                _this.target.target_x                               = data[i].puckX;
                _this.target.target_y                               = data[i].puckY;

                _this.playerSprites[data[i].id][1].target_x         = data[i].x1; // Update target, not actual position, so we can interpolate
                _this.playerSprites[data[i].id][1].target_y         = data[i].y1;
                _this.playerSprites[data[i].id][1].target_rotation  = data[i].angle1;
                velX = _this.target.target_x - _this.target.body.x;
                velY = _this.target.target_y - _this.target.body.y;
        }
    }

})



setInterval(function () {
    var dataToSend;
    if(typeof _this.playerSprites !== "undefined"){
        dataToSend = preparePlayersDataToSend();
    }
    if(dataToSend !== undefined){
        socket.emit('player_update', dataToSend);
    }
}, emitRate);

function preparePlayersDataToSend() {  
    var dataToSend = [];
   /* dataToSend.push({id: socket.id, left: left, right: right, down: down, up: up, brake: brake, shoot: shoot, go_home: go_home, 
        controlPlayer0: _this.playerSprites[socket.id][0].controlPlayer, puckX: _this.puck.x, puckY: _this.puck.y, host: host});*/
//console.log("JOHOOO ", Math.abs(_this.playerSprites[socket.id][0].x));
    dataToSend.push({id: socket.id, x: Math.round(_this.playerSprites[socket.id][0].x), y: Math.round(_this.playerSprites[socket.id][0].y), 
            angle: Math.round(_this.playerSprites[socket.id][0].body.rotation* 100) / 100, puckX: Math.round(_this.puck.x), puckY: Math.round(_this.puck.y),
            //host: (_this.playerSprites[socket.id][0].withinPuck || _this.playerSprites[socket.id][1].withinPuck),
            x1: Math.round(_this.playerSprites[socket.id][1].x), y1: Math.round(_this.playerSprites[socket.id][1].y), angle1: Math.round(_this.playerSprites[socket.id][1].body.rotation* 100) / 100});
//console.log(_this.host)
    return dataToSend;
}

var firstUpd = false; //true;

socket.on('goalScored2', function (puckD){
    updateScore2(puckD);
        console.log(" goalscored2 sent speed: ", puckD);
})

socket.on('goalScored1',  function (puckD){
    updateScore1(puckD);
    console.log(" goalscored2 sent speed: ", puckD);
})



socket.on('state_update', function (data) {

    if(_this.playerSprites !== undefined){
        // The 'playerSprites' object exists.
        for(let i= 0, len = data.length; i<2; i+=1){

            if(_this.playerSprites[data[i].id]){
          

            }
                
            // No property was found for the player that this socket ID belongs to. Add a sprite for them.
            else {
                
                if (host){
                    host = false;
                    //_this.playerSprites[data[i].id] =  new Player(_this, data[i].x, data[i].y, 'ball1m');
                    _this.playerSprites[data[i].id] = {};
                    _this.playerSprites[data[i].id][0] =  new Player(_this, 150*sizer, 300, 'ball1m', true, (data[i].id === this.id));//myXor(_this.host, data[i].host));
                    _this.playerSprites[data[i].id][1] =  new Player(_this, 350*sizer, 300, 'ball1m', true, (data[i].id === this.id));
                    //_this.playerSprites[data[i].id].host = true;

                    _this.playerSprites[data[i].id][0].controlPlayer = false;
                    _this.playerSprites[data[i].id][0].body.rotation = Math.PI / 2.7;
                    _this.playerSprites[data[i].id][1].body.rotation = Math.PI / 2.7;
                    _this.playerSprites[data[i].id].host = true;
                    _this.playerSprites[data[i].id].puckSlowCount = 0;
                    _this.playerSprites[data[i].id].puckX = 540;
                    _this.playerSprites[data[i].id].puckY = 300;
                    _this.puck = new Puck(_this, 450*sizer, 300, true);
                    _this.target = new Puck(_this, 450*sizer, 300, false);
                }
                else{
                    _this.playerSprites[data[i].id] = {}
                    _this.playerSprites[data[i].id].host = false;
                    _this.playerSprites[data[i].id].puckSlowCount = 0;
                    _this.playerSprites[data[i].id].puckX = 540;
                    _this.playerSprites[data[i].id].puckY = 300;
                    _this.playerSprites[data[i].id][0] =  new Player(_this, 750*sizer, 300, 'ball', false, (data[i].id === this.id));
                    _this.playerSprites[data[i].id][1] =  new Player(_this, 550*sizer, 300, 'ball', false, (data[i].id === this.id));
                    

                    _this.playerSprites[data[i].id][0].controlPlayer = false;
                    _this.playerSprites[data[i].id][0].body.rotation = - Math.PI  / 2.7;
                    _this.playerSprites[data[i].id][1].body.rotation = - Math.PI  / 2.7;
                }

            }
        }
    }

});


// Create the game object for the game. This is what the
// Phaser states, and your own game data, are added on to.
FunkyMultiplayerGame = {};

FunkyMultiplayerGame.Boot = function () {
};

FunkyMultiplayerGame.Boot.prototype = {

    create: function () {
        _this = this;
        _this.physics.startSystem(Phaser.Physics.P2JS);

        _this.physics.p2.updateBoundsCollisionGroup();

        _this.game.stage.disableVisibilityChange = true;
        this.state.start('Preload');
    },



    events: (function () {
        socket.on('disconnect', function () {
            console.log("The server disconnected. ")
        });
    })()
};

function myXOR(a,b) {
  return ( a || b ) && !( a && b );
}