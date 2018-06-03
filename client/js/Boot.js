 
 

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

socket.on('hello_client', function (data) {
    console.log("");
    console.log("* * * hello_client event received from server.");
    console.log("* Data was also sent:");
    console.log(data);
});

socket.on('how_are_you', function () {
    console.log("");
    console.log("* * * how_are_you event received from server.");
    console.log("* Try sending an event back. You can use the browser console to send events manually.");
    console.log("* Type in `socket.emit('im_fine');` and hit enter.");
});

socket.on('good_to_hear', function () {
    console.log("");
    console.log("* * * good_to_hear event received from server.");
    console.log("* That's good to hear. :)");
    console.log("* Now try sending an event with some data to the server.");
    console.log("* Let's change the username stored on the socket for this client on the server.");
    console.log("* Type in `socket.emit('change_username', {username: 'PUT A NEW USERNAME HERE'});` and hit enter.");
    console.log("* Now check the output in the command line console that the server is running in.");
});

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
            //console.log("receiving data from", data[i].id);
             /*   puck.x = data[i].puckX;
                puck.y = data[i].puckY;*/
                //console.log(this.id);

            //if(data[i].id != this.id){
                //console.log("puck.x ", puck.x  )

/*
                if(_this.playerSprites[data[i].id][0].target_x != undefined){
                    _this.playerSprites[data[i].id][0].body.x += (_this.playerSprites[data[i].id][0].target_x - _this.playerSprites[data[i].id][0].body.x) / divisor;
                    _this.playerSprites[data[i].id][0].body.y += (_this.playerSprites[data[i].id][0].target_y - _this.playerSprites[data[i].id][0].body.y) / divisor;
                    // Interpolate angle while avoiding the positive/negative issue 
                    
                    angle = _this.playerSprites[data[i].id][0].target_rotation;
                    dir = (angle - _this.playerSprites[data[i].id][0].body.rotation) / (Math.PI * 2);
                    dir -= Math.round(dir);
                    dir = dir * Math.PI * 2;
                    _this.playerSprites[data[i].id][0].body.rotation += dir / divisor;
                }
                if(_this.playerSprites[data[i].id][1].target_x != undefined){
                    _this.playerSprites[data[i].id][1].body.x += (_this.playerSprites[data[i].id][1].target_x - _this.playerSprites[data[i].id][1].body.x) / divisor;
                    _this.playerSprites[data[i].id][1].body.y += (_this.playerSprites[data[i].id][1].target_y - _this.playerSprites[data[i].id][1].body.y) / divisor;
                    // Interpolate angle while avoiding the positive/negative issue 
                    angle = _this.playerSprites[data[i].id][1].target_rotation;
                    dir = (angle - _this.playerSprites[data[i].id][1].body.rotation) / (Math.PI * 2);
                    dir -= Math.round(dir);
                    dir = dir * Math.PI * 2;
                    _this.playerSprites[data[i].id][1].body.rotation += dir / divisor;
                    //console.log(_this.playerSprites[data[i].id].target_x );
                }
*/

// && (this.host === false)){
                    /*_this.target.body.x += (_this.puck.target_x - _this.target.body.x) / divisor;
                    _this.target.body.y += (_this.puck.target_y - _this.target.body.y) / divisor;*/
            
                    //console.log(_this.host);
                    //_this.host = false;
                    //console.log("grey horse ", _this.playerSprites[data[i].id].host);
                    if(_this.playerSprites[data[i].id].host === data[i].host){
                        //if((data[i].puckX != undefined) && (data[i].puckX != null)){
                            //_this.puck.body.x += (_this.puck.target_x - _this.puck.body.x) / divisor;
                            //_this.puck.body.y += (_this.puck.target_y - _this.puck.body.y) / divisor;
                            isHost = true;
                            _this.puck.body.x = _this.target.body.x;
                            _this.puck.body.y = _this.target.body.y;

                            _this.target.visible = true;
                            _this.puck.visible = false;
                            _this.puck.collides = false;
                            //puck.body.x += (data[i].puckX + puck.body.x) / 3;
                            //puck.body.y += (data[i].puckY + puck.body.y) / 3;
                        //console.log(_this.puck.body.y);
                        //}
                    }
                
                    else{
                        //_this.host = true;
                    //_this.puck.body.x = _this.target.body.x;
                    //_this.puck.body.y = _this.target.body.y;
                        if (isHost){
                            //_this.puck.body.velocity.x = _this.target.body.velocity.x * 3;
                            //_this.puck.body.velocity.y = _this.target.body.velocity.y * 3;
                            //_this.puck.angle = 0;//_game.physics.arcade.angleBetween(_this.target, _this.puck)
                            /*_this.puck.body.velocity = Math.sqrt((_this.target.target_x - data[i].puckX)*(_this.target.target_x - data[i].puckX) + (_this.target.target_y - data[i].puckY)
                               * (_this.target.target_x - data[i].puckX) + (_this.target.target_y - data[i].puckY));*/
                            //_this.target.body.angle = _this.puck.angle;
                            _this.puck.body.velocity.x = velX *20;//(data[i].puckX - _this.target.body.x) * 3;
                            _this.puck.body.velocity.y = velY *20;//(data[i].puckY - _this.target.body.y) * 3;
                            //_this.target.body.velocity.x = (data[i].puckX - _this.target.target_x) / 3 ;
                            //_this.target.body.velocity.y = (data[i].puckY - _this.target.target_y) / 3 ;
                            //_this.target.body.velocity.x = data[i].puckX - _this.target.target_x ;
                            //_this.target.body.velocity.y = data[i].puckY - _this.target.target_y  ;

                            //_this.target.body.velocity = _this.puck.body.velocity;
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
            //}  

                    //if (_this.playerSprites[data[i].id][0].host === true){
                    //socket.in('game-room').emit('puckPos', {x: data.x, y: data.y});
                    //socket.emit('puckPos', {x: puck.body.x, y: puck.body.y});
                    //console.log("x: ", puck.body.x);
                    //console.log(len);*/
                //if(_this.playerSprites[data[i].id].host){
                    //if(_this.playerSprites[data[i].id] != socket.id){
 /*                       _this.puck.body.x = data[i].puckX;
                        _this.puck.body.y = data[i].puckX;*/


   /*             console.log(data[i].puckX)
                _this.puck.target_x = (data[i].puckX + _this.puck.body.position.x) / 2;
                _this.puck.target_y = (data[i].puckY + _this.puck.body.position.y) / 2;
                    _this.puck.body.x += (_this.puck.target_x - _this.puck.body.x) / 3;
                    _this.puck.body.y += (_this.puck.target_y - _this.puck.body.y) / 3;*/

                /*if (_this.playerSprites[data[i].id][0].host === true){
                    //socket.in('game-room').emit('puckPos', {x: data.x, y: data.y});
                    socket.emit('puckPos', {x: puck.body.x, y: puck.body.y});
                    //console.log("x: ", puck.body.x);
                    //console.log(len);
                }*/
                /*
                else
                {
                    target.body.x += (puck.target_x - target.body.x) / 3;
                    target.body.y += (puck.target_y - target.body.y) / 3;
                }*/

/*
                if(_this.playerSprites[data.id].host === false){
                    _this.puck.x = data[0].puckX;
                    _this.puck.y = data[0].puckY;
                }*/
            
            /*
            else{
                if (_this.host === false){
                    if (checkOverlap(_this.playerSprites[data[i].id][i], _this.puck)){
                        _this.host = true;
                    }
                }
            }*/
        }
    }


/*
    if((_this.playerSprites !== undefined)  || (_this.playerSprites !== null)){
        for(let i= 0, len = data.length; i<len; i+=1){
            if(_this.playerSprites[data[i].id]){
        // The 'playerSprites' object exists.
        //for(let i= 0; i<2; i+=1){
        //if(_this.playerSprites[data.id]){
                    for (var j = 0; j < 2; j++){
                        if (_this.playerSprites[data[i].id][j].controlPlayer === true){
                            if (data[i].left === true){
                                //left = true;
                                _this.playerSprites[data[i].id][j].isDownA = true;
                            }
                            else
                                _this.playerSprites[data[i].id][j].isDownA = false;
                            if (data[i].right === true){
                                //right = true;
                                _this.playerSprites[data[i].id][j].isDownD = true;
                            }
                            else
                                _this.playerSprites[data[i].id][j].isDownD = false;
                            if (data[i].down === true){
                                //down = true;
                                _this.playerSprites[data[i].id][j].isDownS = true;
                            }
                            else
                                _this.playerSprites[data[i].id][j].isDownS = false;
                            if (data[i].up === true){
                                //up = true;
                                _this.playerSprites[data[i].id][j].isDownW = true;
                            }
                            else
                                _this.playerSprites[data[i].id][j].isDownW = false;
                            if (data[i].brake === true){
                                //brake = true;
                                _this.playerSprites[data[i].id][j].isDownV = true;
                            }
                            else
                                _this.playerSprites[data[i].id][j].isDownV = false;
                            if (data[i].shoot === true){
                                //shoot = true;
                                _this.playerSprites[data[i].id][j].isDownB = true;
                            }
                            else
                                _this.playerSprites[data[i].id][j].isDownB = false;
                        }
                    }
            
            }
  
        }
    }*/

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
    

    //}
    //console.log("sending updates");

    // Send the data to all clients in the room called 'game-room'.

/*function preparePlayersDataToSend() {
    // Prepare the positions of the players, ready to send to all players.
    var dataToSend = [];
    // 'players' is an object, so get a list of the keys.
    var keys = Object.keys(players);
    // Loop though the list of players and get the position of each player.
    keys.forEach(function (key) {
        // Add the position (and ID, so the client knows who is where) to the data to send.
        dataToSend.push({id: key, x: players[key][0].x, y: players[key][0].y, angle: players[key][0].angle,/* puckX: players[key].puckX, puckY: players[key].puckY*/
              /* x1: players[key][1].x, y1: players[key][1].y, angle1: players[key][1].angle});
    });
    return dataToSend;
}*/

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
            /*
                //_this.playerSprites[socket.id].puckX = puck.x;
                //_this.playerSprites[socket.id].puckY = puck.y;
                _this.playerSprites[data[i].id][0].target_x        = data[i].x; // Update target, not actual position, so we can interpolate
                _this.playerSprites[data[i].id][0].target_y        = data[i].y;
                _this.playerSprites[data[i].id][0].target_rotation = data[i].angle;
                _this.playerSprites[data[i].id][1].target_x        = data[i].x1; // Update target, not actual position, so we can interpolate
                _this.playerSprites[data[i].id][1].target_y        = data[i].y1;
                _this.playerSprites[data[i].id][1].target_rotation = data[i].angle1;
                // This player's sprite exists. Update its position.
                //_this.add.tween(_this.playerSprites[data[i].id]).to({x: data[i].x, y: data[i].y}, 1000/10, null, false); 
                //_this.playerSprites[data[i].id].body.angle = data[i].angle;  
                if(_this.playerSprites[data[i].id][0].target_x != undefined){
                    _this.playerSprites[data[i].id][0].body.x += (_this.playerSprites[data[i].id][0].target_x - _this.playerSprites[data[i].id][0].body.x) / 3;
                    _this.playerSprites[data[i].id][0].body.y += (_this.playerSprites[data[i].id][0].target_y - _this.playerSprites[data[i].id][0].body.y) / 3;
                    // Interpolate angle while avoiding the positive/negative issue 
                    var angle = _this.playerSprites[data[i].id][0].target_rotation;
                    var dir = (angle - _this.playerSprites[data[i].id][0].rotation) / (Math.PI * 2);
                    dir -= Math.round(dir);
                    dir = dir * Math.PI * 2;
                    _this.playerSprites[data[i].id][0].rotation += dir / 3;
                    //console.log(_this.playerSprites[data[i].id].target_x );
                }
                if(!_this.playerSprites[data[i].id].host){
                    //if(_this.playerSprites[data[i].id] != socket.id){
                        //_this.puck.x = data[i].puckX;
                        //_this.puck.y = data[i].puckY;
                    //}
                    //if (_this.playerSprites[data[i].id][0].host === true){
                    //socket.in('game-room').emit('puckPos', {x: data.x, y: data.y});
                    //socket.emit('puckPos', {x: puck.body.x, y: puck.body.y});
                    //console.log("x: ", puck.body.x);
                    //console.log(len);
                }
                /*
                else
                {
                    target.body.x += (puck.target_x - target.body.x) / 3;
                    target.body.y += (puck.target_y - target.body.y) / 3;
                }*/


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
                    /*
                    if (_this.playerSprites[data[i].id][1].stick2){
                                                _this.physics.p2.enable(_this.playerSprites[data[i].id][0].stick2);
                        _this.physics.p2.enable(_this.playerSprites[data[i].id][1].stick2);
                        _this.playerSprites[data[i].id][0].stick2.body.collideWorldBounds = false;
                        _this.playerSprites[data[i].id][0].stick2.body.setCollisionGroup(_this.stickCollisionGroup);
                        _this.playerSprites[data[i].id][0].stick2.body.collides(_this.puckCollisionGroup);
                        _this.playerSprites[data[i].id][1].stick2.body.collideWorldBounds = false;
                        _this.playerSprites[data[i].id][1].stick2.body.setCollisionGroup(_this.stickCollisionGroup);
                        _this.playerSprites[data[i].id][1].stick2.body.collides(_this.puckCollisionGroup);
                    //_this.playerSprites[data[i].id].body.angle = Math.PI;
                    }*/
                }
                else{
                    //console.log("_this.id : ", _this.id)
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
/*
                    if (_this.playerSprites[data[i].id][1].stick2){
                        _this.physics.p2.enable(_this.playerSprites[data[i].id][0].stick2);
                        _this.physics.p2.enable(_this.playerSprites[data[i].id][1].stick2);
                        _this.playerSprites[data[i].id][0].stick2.body.collideWorldBounds = false;
                        _this.playerSprites[data[i].id][0].stick2.body.setCollisionGroup(_this.stickCollisionGroup);
                        _this.playerSprites[data[i].id][0].stick2.body.collides(_this.puckCollisionGroup);
                        _this.playerSprites[data[i].id][1].stick2.body.collideWorldBounds = false;
                        _this.playerSprites[data[i].id][1].stick2.body.setCollisionGroup(_this.stickCollisionGroup);
                        _this.playerSprites[data[i].id][1].stick2.body.collides(_this.puckCollisionGroup);
                    //_this.playerSprites[data[i].id].body.angle = Math.PI;
                    }*/


                    //_this.playerSprites[data[i].id][2] =  new Circle(_this, 450, 20);
                    //_this.playerSprites[data[i].id][2] =  new Player(_this, 550, 400, 'ball');
                    //_this.playerSprites[data[i].id][2] =  new Puck(_this, 450, 350, );


                    //_this.playerSprites[data[i].id].collides = false;
                    //_this.playerSprites[data[i].id].body.angle = -Math.PI;
                }


                //_this.playerSprites[data[i].id][2] =  new Puck(_this, 450, 350);
                //_this.playerSprites[data[i].id][3] =  new Player(_this, 550, 100, 'ball');
                //_this.playerSprites[data[i].id] = _this.add.sprite(data[i].x, data[i].y, 'red-fly');
                //puck =  new Puck(_this, 450, 350);
                //console.log(_this.playerSprites[data[i].id].puck);
                /*
                _this.playerSprites[data[i].id][0].body.setCollisionGroup(puckCollisionGroup);
                _this.playerSprites[data[i].id][0].body.collides([stickCollisionGroup, puckCollisionGroup]);
                _this.playerSprites[data[i].id][1].body.setCollisionGroup(puckCollisionGroup);
                _this.playerSprites[data[i].id][1].body.collides([stickCollisionGroup, puckCollisionGroup]);*/
                //_this.playerSprites[data[i].id].stick1.body.setCollisionGroup(stickCollisionGroup);
                //_this.playerSprites[data[i].id].stick1.body.collides(puckCollisionGroup);
                        
            }
        }
    }

});


/*
socket.on('key_pressed', function(data){
    //console.log("Key that was pressed: " + data.key);
//if (data.playerId === socket.id){
    var i;
    if(_this.playerSprites[data.playerId][1].controlPlayer)
        i = 1;
    else
        i = 0;


    if (data.key == 'left') {
        if(data.state == 'down'){
            _this.playerSprites[data.playerId][i].isDownA = true;
            console.log("Receive leftpress from server :", socket.id, " ", _this.playerSprites[data.playerId][0].controlPlayer);
                        console.log("Receive leftpress from server :", socket.id, " ", _this.playerSprites[data.playerId][1].controlPlayer);
        }
        else{
            _this.playerSprites[data.playerId][i].isDownA = false;
            console.log("Receive leftkey up from server");
        }
    }
    if (data.key == 'right') {
        if(data.state == 'down')
            _this.playerSprites[data.playerId][i].isDownD = true;
        else
            _this.playerSprites[data.playerId][i].isDownD = false;
    }
    if (data.key == 'down') {
        if(data.state == 'down')
            _this.playerSprites[data.playerId][i].isDownS = true;
        else
            _this.playerSprites[data.playerId][i].isDownS = false;
    }
    if (data.key == 'up') {
        if(data.state == 'down')
            _this.playerSprites[data.playerId][i].isDownW = true;
        else
            _this.playerSprites[data.playerId][i].isDownW = false;
    }
    if (data.key == 'brake') {
        if(data.state == 'down')
            _this.playerSprites[data.playerId][i].isDownV = true;
        else
            _this.playerSprites[data.playerId][i].isDownV = false;
    }
    if (data.key == 'shoot') {
        if(data.state == 'down')
            _this.playerSprites[data.playerId][i].isDownB = true;
        else
            _this.playerSprites[data.playerId][i].isDownB = false;
    }
    if (data.key == 'down') {
        if(data.state == 'down')
            _this.playerSprites[data.playerId][i].isDownS = true;
        else
            _this.playerSprites[data.playerId][i].isDownS = false;
    }
//}

})*/




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