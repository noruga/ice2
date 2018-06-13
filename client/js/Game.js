var rink;

var bmd, bmd1, bmd2;
var stick, stick1, stickm, stick1m;
var bounds;
var puck;
var player, player1, player2, player3;
var goal1, goal2, goal3, goal4, goal5, goal6;
var score1     = 0;
var score2     = 0;
var goalsensor1, goalsensor2;
var scoreString;
var goalscored = false;
var waitTwoSec = false;
var waitSecs   = 0;
var shotpause  = 0;
var shotpause1 = 0;
var scoreText1, scoreText2, scoreText3;
var gameEnd    = false;
var goalarea1, goalarea2;
var areaSecs1  = 0;
var areaSecs2  = 0;
var n_count    = 0;
var fx;
var controlled = true;
var target;
var homePoint, homePoint1, forwPoint1, forwPoint2, forwPoint3, forwPoint4;
var stickCollisionGroup
    , puckCollisionGroup
    , goalsensorGroup;
var score1 = 0;
var score2 = 0;
var goalscored = false;
var waitTwoSec = false;
var tween;
var fx1;
var sizer = 1.2;

var puckD = 1;

var puckCoordX = 540;
var puckCoordY = 300;   // to measure puck speed




var accelerateRemote = true;

FunkyMultiplayerGame.Game = function () {
};

FunkyMultiplayerGame.Game.prototype = {

    create: function () {
        // Create an external reference to this function context so we can access this game state from the socket callbacks.
        _this = this;
        fx = _this.add.audio('sfx');
        fx1 = _this.add.audio('hit')

        // Create an object to hold references to the player sprites.
        this.playerSprites = {};
        this.puck;

        //this.hostess = false;

        this.add.text(120, 20, "Use Up/Down/Left/Right\nkeys to move.", {
            font : "40px Arial",
            fill : '#ffffff',
            align: 'center'
        });
        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.time.events.add(Phaser.Timer.SECOND * 150, finalScore, this);
        this.physics.p2.restitution = 0.1;

        stickCollisionGroup = _this.physics.p2.createCollisionGroup();
        puckCollisionGroup  = _this.physics.p2.createCollisionGroup();
        goalsensorGroup     = _this.physics.p2.createCollisionGroup();


        rink = this.add.tileSprite(0, 0, 1080, 600, 'starfield');
        homePoint = this.add.sprite(112*sizer, 319, null);
        homePoint1  = this.add.sprite(788*sizer, 281, null);


        forwPoint1  = this.add.sprite(720*sizer, 100, null);
        forwPoint2  = this.add.sprite(720*sizer, 500, null);
        forwPoint3  = this.add.sprite(180*sizer, 100, null);
        forwPoint4  = this.add.sprite(180*sizer, 500, null);


        scoreText = _this.add.text(300*sizer, 10, 'Score : ' + score1 + " : " + score2, { font: '34px Arial', fill: '#0066cc' });
        scoreText2 = _this.add.text(200*sizer, 300, "" ,{ font: '100px Arial', fill: '#bbf' });
        scoreText1 = _this.add.text(1, 10, "Time : " + this.game.time.events.duration/60, { font: '34px Arial', fill: '#cc0000' });
        scoreText3 = _this.add.text(400*sizer, 500, " " );


        //############ The Corners ##############
        var cornerRec   = this.add.sprite(874*sizer, 595, 'cornerRec');
        cornerRec.angle = -45;
        this.physics.p2.enable(cornerRec);
        //cornerRec.angle = -45;
        //game.physics.enable(cornerRec, Phaser.Physics.ARCADE);
        cornerRec.body.static             = true;
        cornerRec.body.collideWorldBounds = false;
        cornerRec.body.setCollisionGroup(puckCollisionGroup);
        cornerRec.body.collides([puckCollisionGroup]);


        var cornerRec1   = this.add.sprite(874*sizer, 5, 'cornerRec');
        cornerRec1.angle = 45;
        this.physics.p2.enable(cornerRec1);
        //cornerRec.angle = -45;
        //game.physics.enable(cornerRec, Phaser.Physics.ARCADE);
        cornerRec1.body.static             = true;
        cornerRec1.body.collideWorldBounds = false;
        cornerRec1.body.setCollisionGroup(puckCollisionGroup);
        cornerRec1.body.collides([puckCollisionGroup]);

        var cornerRec2   = this.add.sprite(0, 25, 'cornerRec');
        cornerRec2.angle = -45;
        this.physics.p2.enable(cornerRec2);
        //cornerRec.angle = -45;
        //game.physics.enable(cornerRec, Phaser.Physics.ARCADE);
        cornerRec2.body.static             = true;
        cornerRec2.body.collideWorldBounds = false;
        cornerRec2.body.setCollisionGroup(puckCollisionGroup);
        cornerRec2.body.collides([puckCollisionGroup]);

        var cornerRec3   = this.add.sprite(0, 595, 'cornerRec');
        cornerRec3.angle = 45;
        this.physics.p2.enable(cornerRec3);
        //cornerRec.angle = -45;
        //game.physics.enable(cornerRec, Phaser.Physics.ARCADE);
        cornerRec3.body.static             = true;
        cornerRec3.body.collideWorldBounds = false;
        cornerRec3.body.setCollisionGroup(puckCollisionGroup);
        cornerRec3.body.collides([puckCollisionGroup]);

        cornerRec.visible  = false;
        cornerRec1.visible = false;
        cornerRec2.visible = false;
        cornerRec3.visible = false;
        //###### End Corners ############



        // #############The Goals#################
        goal6 = this.add.sprite(844*sizer, 297, 'goallong1');
        //goal6.body.angle = 180;
        goal3 = this.add.sprite(56*sizer, 298, 'goallong1');

        goal1 = this.add.sprite(67*sizer, 247, 'goalshort');
        goal2 = this.add.sprite(67*sizer, 350, 'goalshort');

        goal4 = this.add.sprite(832*sizer, 247, 'goalshort');
        goal5 = this.add.sprite(832*sizer, 350, 'goalshort');


        goalsensor1         = this.add.sprite(60*sizer, 259, 'goalsensor');
        goalsensor2         = this.add.sprite(837*sizer, 259, 'goalsensor');
        goalsensor1.visible = false;
        goalsensor2.visible = false;

        goalarea1         = this.add.sprite(81*sizer, 241, 'goalarea');
        goalarea2         = this.add.sprite(774*sizer, 241, 'goalarea');
        goalarea1.visible = false;
        goalarea2.visible = false;
        goalarea1.anchor.setTo(0.5, 0.5);

        this.physics.p2.enable([goal1, goal2, goal3, goal4, goal5, goal6]);

        goal1.body.setCollisionGroup(puckCollisionGroup);
        goal2.body.setCollisionGroup(puckCollisionGroup);
        goal3.body.setCollisionGroup(puckCollisionGroup);
        goal4.body.setCollisionGroup(puckCollisionGroup);
        goal5.body.setCollisionGroup(puckCollisionGroup);
        goal6.body.setCollisionGroup(puckCollisionGroup);
        goal1.body.collides([puckCollisionGroup]);     //
        goal2.body.collides([puckCollisionGroup]);
        goal3.body.collides([puckCollisionGroup]);
        goal4.body.collides([puckCollisionGroup]);
        goal5.body.collides([puckCollisionGroup]);
        goal6.body.collides([puckCollisionGroup]);

        this.physics.p2.enable([goal1, goal2, goal3, goal4, goal5, goal6]);
        goal1.body.static = true;
        goal2.body.static = true;
        goal3.body.static = true;
        goal4.body.static = true;
        goal5.body.static = true;
        goal6.body.static = true;

        goal6.body.angle = 180;
        this.physics.p2.updateBoundsCollisionGroup();
        this.game.stage.disableVisibilityChange = true;
        this.mapKeys();

    },

    update: function () {
        if (this.mdown)
            this.m_count++;

        if (waitTwoSec == true){
            waitSecs++;
            if (waitSecs == 180){
                _this.puck.reset(540, 300);
                _this.puck.target_x = 450;
                _this.puck.target_y = 300;
            }
            else if (waitSecs > 180){
                goalscored = false;                     //goals will again be counted
                waitTwoSec = false;                     //the two secs are over
                waitSecs = 0;
                scoreText2.text = (600*sizer, 400, " ");      //Erases the 'GOAL!!!'
                scoreText3.text = (600*sizer, 400, " ");  
            }

        };
        scoreText1.text =  " Time : "+ Math.floor(this.game.time.events.duration/1000);
    },
    mapKeys: function() {
        var keys = {
            'left' : this.game.input.keyboard.addKey(Phaser.Keyboard.A),
            'right': this.game.input.keyboard.addKey(Phaser.Keyboard.D),
            'down' : this.game.input.keyboard.addKey(Phaser.Keyboard.S),
            'up'   : this.game.input.keyboard.addKey(Phaser.Keyboard.W),
            'brake': this.game.input.keyboard.addKey(Phaser.Keyboard.V),
            'shoot': this.game.input.keyboard.addKey(Phaser.Keyboard.B),
            'swap' : this.game.input.keyboard.addKey(Phaser.Keyboard.N),
            'M'    : this.game.input.keyboard.addKey(Phaser.Keyboard.M),
            'left1': this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
            'right1': this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
            'up1': this.game.input.keyboard.addKey(Phaser.Keyboard.UP),
            'down1': this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
        };
        var cursors = this.game.input.keyboard.createCursorKeys();



        for (var keyName in keys) {
            (function (keyName) {
                keys[keyName].onDown.add(function () {
                    //for (var i in _this.playerSprites){}


                    for (var j = 0; j < 2; j++){
                        if (_this.playerSprites[socket.id][j]){
                        if (_this.playerSprites[socket.id][j].controlPlayer === true){
                            if (keyName === 'left' || keyName === 'left1'){
                                //left = true;
                                _this.playerSprites[socket.id][j].isDownA = true;
                            }
                            if (keyName === 'right' || keyName === 'right1'){
                                //right = true;
                                console.log("clicked right")
                                _this.playerSprites[socket.id][j].isDownD = true;
                            }

                            if (keyName === 'down' || keyName === 'down1'){
                                //down = true;
                                _this.playerSprites[socket.id][j].isDownS = true;
                            }
                            if (keyName === 'up' || keyName === 'up1'){
                                //up = true;
                                //console.log("up: ", up)
                                _this.playerSprites[socket.id][j].isDownW = true;
                            }
                            if (keyName === 'shoot'){
                                //shoot = true;
                                _this.playerSprites[socket.id][j].isDownB = true;
                            }
                            else if (keyName === 'brake'){
                                //brake = true;
                                _this.playerSprites[socket.id][j].isDownV = true;
                            }

                            if (keyName === 'swap'  && n_count === 0){
                                n_count++;
                                if (_this.playerSprites[socket.id][0].controlPlayer === true){
                                    _this.playerSprites[socket.id][0].controlPlayer = false;
                                    _this.playerSprites[socket.id][1].controlPlayer = true;
                                }
                                else{
                                    _this.playerSprites[socket.id][1].controlPlayer = false;
                                    _this.playerSprites[socket.id][0].controlPlayer = true;
                                }
                                    _this.playerSprites[socket.id][j].isDownA = false;
                                    _this.playerSprites[socket.id][j].isDownS = false;
                                    _this.playerSprites[socket.id][j].isDownD = false;
                                    _this.playerSprites[socket.id][j].isDownW = false;
                                    _this.playerSprites[socket.id][j].isDownV = false;
                                    _this.playerSprites[socket.id][j].isDownB = false;
                                    _this.playerSprites[socket.id][j].isDownM = false;
                            }
                            if (keyName === 'M'){
                                if(_this.playerSprites[socket.id][1].controlPlayer === false)
                                    _this.playerSprites[socket.id][1].isDownM = true;
                                else
                                    _this.playerSprites[socket.id][0].isDownM = true;

                            }
                        }
                        }
                    }
                });
                keys[keyName].onUp.add(function () {

                    for (var j = 0; j < 2; j++){
                        //if (_this.playerSprites[socket.id][j].controlPlayer === true){
                            if (keyName === 'left' || keyName === 'left1'){
                                //left = false;
                                _this.playerSprites[socket.id][j].isDownA = false;
                            }
                            if (keyName === 'right' || keyName === 'right1'){
                                _this.playerSprites[socket.id][j].isDownD = false;
                                //right = false;
                            }

                            if (keyName === 'down' || keyName === 'down1'){
                                _this.playerSprites[socket.id][j].isDownS = false;
                                //down = false;
                            }
                            if (keyName === 'up' || keyName === 'up1'){
                                //up = false;
                                _this.playerSprites[socket.id][j].isDownW = false;
                            }
                            if (keyName === 'shoot'){
                                //shoot = false;
                                _this.playerSprites[socket.id][j].isDownB = false;
                            }
                            else if (keyName === 'brake'){
                                //brake = false;
                                _this.playerSprites[socket.id][j].isDownV = false;
                            }

                            if (keyName === 'swap'){
                                n_count = 0;
                            }
                            if (keyName === 'M'){
                                if(_this.playerSprites[socket.id][j].controlPlayer === false)
                                    _this.playerSprites[socket.id][j].isDownM = false;
                            }              
                        }
                });
            })(keyName)

        }
    }
};

Puck = function(game, x, y, authorative){

    // #############THE PUCK#######################



    var bmd1 = game.add.bitmapData(15, 15, 'rgb(0,200,0)');
    bmd1.circle(7, 7, 6, 0);

        Phaser.Sprite.call(this, game, x, y, bmd1);

    

    game.physics.p2.enable(this);
    this.authorative = authorative;
    this.body.setCircle(7);
    this.body.mass = 0.00001;
    this.divisor = 3;
        //puck.visible = false;
        game.physics.enable(this, Phaser.Physics.ARCADE);


    //this.body.collideWorldBounds = true;
    this.body.clearCollision(true);
    this.lastX = 540;
    this.lastY = 300;

    this.master = false;

    this.target_x = 450;
    this.target_y = 300;

    if (authorative){
        //this.visible = true;
        this.body.setCollisionGroup(puckCollisionGroup);
        this.body.collides([stickCollisionGroup, puckCollisionGroup]);
    }

    else{
        this.visible = false;
        this.collides = false;
    }

    game.add.existing(this);

}
Puck.prototype             = Object.create(Phaser.Sprite.prototype);
Puck.prototype.constructor = Puck;


Puck.prototype.update = function () {


    if (this.authorative === true){
        this.body.velocity.x *= 0.995;
        this.body.velocity.y *= 0.995;
        if (goalscored === false){                   //to register goal only once
            //if(puck.prevx < )
            if (checkOverlap(this, goalsensor1))
            {
                if ((this.lastY > 350 || this.lastY < 242)){
                    this.body.x = this.lastX;
                    this.body.y = this.lastY;
            
                }
                else{
                    puckD = Math.sqrt((puckCoordX - this.body.x)*(puckCoordX - this.body.x) + (puckCoordY - this.body.y)*(puckCoordY - this.body.y));
                    goalscored = true;
                    socket.emit('goalScored2', Math.floor(puckD/2));
                    this.body.velocity.x = this.body.velocity.x * 0.01;
                    this.body.velocity.y = this.body.velocity.y * 0.01;
                }
    
            };

            if (checkOverlap(this, goalsensor2))
            {
                    goalscored = true;
                    puckD = Math.sqrt((puckCoordX - this.body.x)*(puckCoordX - this.body.x) + (puckCoordY - this.body.y)*(puckCoordY - this.body.y));
                    socket.emit('goalScored1', Math.floor(puckD/2));
                    this.body.velocity.x = this.body.velocity.x * 0.01;
                    this.body.velocity.y = this.body.velocity.y * 0.01;
                //}
            };
        };
    }
    else{
        this.body.x += (this.target_x - this.body.x) / this.divisor;
        this.body.y += (this.target_y - this.body.y) / this.divisor;
        this.divisor--;
        if (this.divisor === 0)
            this.divisor = 3;

    }
    this.lastX = this.body.x;
    this.lastY = this.body.y;
}

Player = function (game, x, y, img, host, hostStick) {
    Phaser.Sprite.call(this, game, x, y, img);

    this.divisor = 3;

    this.isDownA = false;
    this.isDownS = false;
    this.isDownD = false;
    this.isDownW = false;
    this.isDownV = false;
    this.isDownB = false;
    this.isDownN = false;
    this.isDownM = false;

    this.goForw = false;
    this.goHome = false;

    this.withinPuck = false;


    this.divisor = 3;
    this.isClosePuck = false;



    _this.game.physics.p2.enable(this);
    this.body.setCircle(14);
    this.anchor.setTo(0.5, 0.5);
    
    
     this.body.setCollisionGroup(puckCollisionGroup);
     this.body.collides([ puckCollisionGroup]) ;
     this.host = host;
     this.hostess = host;
     this.m_count = 0;
     this.hostStick = hostStick;

    this.controlPlayer    = true;
    this.accelerateRemote = false;
    this.target_x;
    this.target_y = 0;
    this.target_rotation;
    // ####This stick is invisible, without collision###############
  if (hostStick){  
    this.stick            = game.add.sprite(x, y, null);
    // #####This stick1 is visible, collides with puck###################
    this.stick1 = game.add.sprite(x, y, 'stick');

    _this.physics.p2.enable(this.stick);
    _this.physics.p2.enable(this.stick1);
    this.stick.body.clearCollision(true);
    this.stick1.body.collideWorldBounds = false;
    this.stick1.body.setCollisionGroup(stickCollisionGroup);
    this.stick1.body.collides(puckCollisionGroup);

    var constraint  = _this.physics.p2.createLockConstraint(this, this.stick, [-30, 0], 0);
    var constraint1 = _this.physics.p2.createLockConstraint(this, this.stick1, [30, 0], 0);
  }
  
  else{
    this.stick2 = (game.add.sprite(x - 30, y, 'stick'));
    this.stick            = game.add.sprite(x, y, null);
    
    _this.physics.p2.enable(this.stick2);
    this.stick2.body.setRectangle(27, 20);
    //_this.physics.p2.enable(this.stick);
    this.stick2.body.clearCollision(true);
    this.stick2.body.collideWorldBounds = false;
    this.stick2.body.setCollisionGroup(stickCollisionGroup);
    this.stick2.body.collides(puckCollisionGroup);
    if (this.host)
        this.stick2.body.rotation = this.body.rotation + Math.PI / 2.7;
    else
        this.stick2.body.rotation = this.body.rotation - Math.PI / 2.7;
  }

    game.add.existing(this);
    console.log("player created")

};

Player.prototype             = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;
Player.prototype.update = function () {

if(!this.controlPlayer){
    this.body.velocity.x *= 0.99;
    this.body.velocity.y *= 0.99;
}
else{
    this.body.velocity.x *= 0.94;
    this.body.velocity.y *= 0.94;
}
    this.body.setZeroRotation();


    if (this.isDownA)
        this.body.rotateLeft(125);
    if (this.isDownD) {
        this.body.rotateRight(125);
    }
    if (this.isDownW) {
        if ((this.body.velocity.x * this.body.velocity.x) + (this.body.velocity.y * this.body.velocity.y) > 25000)
            this.body.thrust(1500);
        else {
            this.body.thrust(3000);
        }
    }

    if(this.isDownS){
        this.body.reverse(500);
    }
    if (this.isDownV) {
        this.body.velocity.x *= 0.9;
        this.body.velocity.y *= 0.9;
        if (distanceSq(_this.puck, this.stick1) < (23*23)){
            for (var id in _this.playerSprites) {
                if (id !== socket.id){
                    if (!(_this.playerSprites[id][0].isClosePuck)){
                        if (!(_this.playerSprites[id][1].isClosePuck))
                            moveToObject(_this.puck, this.stick1, 70);
                    }
                }
            }
        }

    }

    else if (this.isDownB) {
        this.isDownV = false;
        if (checkOverlap(this.stick1, _this.puck)){
            fx1.play();
            puckCoordX = _this.puck.body.x;
            puckCoordY = _this.puck.body.y;
        }
        if (this.isDownA) {
            //this.body.rotateLeft(1200);
            //if (controlPlayer1){
            if (shotpause1 < 12) {
                this.body.rotateLeft(1075);
                shotpause1++;
            }

            else
                shotpause1 = 0;
        }
        else {
            if (shotpause1 < 12) {
                this.body.rotateRight(1200);
                shotpause1++;
            }

            else
                shotpause1 = 0;
            //if (controlPlayer1){
        }

    }
    if (distanceSq(_this.puck, this) < 2500){
        this.withinPuck = true;

    }
    else
        this.withinPuck = false;

    if (this.controlPlayer){
        this.goHome = false;
        this.goForw = false;
    }
    if(this.isDownM){
        this.m_count++;
        this.goHome = false;
        this.goforw = false;
    }
    else{
        if (this.m_count > 0){
            if (this.m_count < 21)
                this.goHome = true;
            else
                this.goForw = true;
        }
        this.m_count = 0;
    }

    if (this.goHome){
        this.goForw = false;
        if (this.host)
            accelerateToPoint(this, homePoint, 400);
        else
            accelerateToPoint(this, homePoint1, 400);
    }
    else if (this.goForw){
        this.goHome = false;
        if (this.host){
            if (this.body.y < 301)
                accelerateToPoint(this, forwPoint1, 400);
            else
                accelerateToPoint(this, forwPoint2, 400);
        }
        else{
            if (this.body.y < 301)
                accelerateToPoint(this, forwPoint3, 400);
            else
                accelerateToPoint(this, forwPoint4, 400);
        }

    }
    
    if (this.hostStick === false){
        if (this.target_y != 0){
            this.body.y += (this.target_y - this.body.y) / this.divisor;
            this.body.x += (this.target_x - this.body.x) / this.divisor;
        let angle = this.target_rotation;
        let dir = (angle - this.body.rotation) / (Math.PI * 2);
        //dir = Math.round(dir);
        dir = dir * Math.PI * 2;
        this.body.rotation += dir / this.divisor;
        this.stick2.body.rotation += dir / this.divisor;
        this.stick2.body.x += (this.target_x - this.stick2.body.x) / this.divisor - Math.cos(this.stick2.body.rotation) * (10);
        this.stick2.body.y += (this.target_y - this.stick2.body.y) / this.divisor - Math.sin(this.stick2.body.rotation) * (10);
        this.divisior--;
        if (this.divisior === 0)
            this.divisor = 3;
        /*
        if ((this.body.x - _this.puck.body.x)*(this.body.x - _this.puck.body.x) + (this.body.y - _this.puck.body.x)*(this.body.y - _this.puck.body.y) < 100*100){
            this.isClosePuck = true;
        }
        else
            this.isClosePuck = false;
*/
        }
    }

};


function moveToObject(obj1, obj2, speed1) {

    var angle            = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
    obj1.body.rotation   = angle + _this.math.degToRad(90); 
    obj1.body.velocity.x = Math.cos(angle) * speed1; 
    obj1.body.velocity.y = Math.sin(angle) * speed1;
}

function checkOverlap(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();
    return Phaser.Rectangle.intersects(boundsA, boundsB);

}
function accelerateToPoint(obj1, obj2, speed) {

    var angle = _this.physics.arcade.angleBetween(obj1, obj2);

    if (checkOverlap(obj1, goalarea1)){
        obj1.body.rotation = -80;

    }
    if (checkOverlap(obj1, goalarea2)){
        obj1.body.rotation = 80;

    }

    if (_this.physics.arcade.distanceBetween(obj1, obj2) < 45){
        obj1.body.velocity.x *= 0.95;
        obj1.body.velocity.y *= 0.95;
        if (obj1.body.y > 400)
            obj1.body.rotation = 160;
        else if (obj1.body.y < 200)
            obj1.body.rotation = -160;
    }

    
    else
        obj1.body.rotation = angle + _this.math.degToRad(90);
    obj1.body.force.x = Math.cos(angle) * speed;   
    obj1.body.force.y = Math.sin(angle) * speed;


}

function checkOverlap(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();
    return Phaser.Rectangle.intersects(boundsA, boundsB);

}
function distanceSq(object,target) {

    var xDif = object.body.x - target.body.x;
    var yDif = object.body.y - target.body.y;

    return (xDif * xDif) + (yDif * yDif);

};


function updateScore1(puckD)
{
    if (waitTwoSec === false){
        score1++;
        scoreText.text = 'Score : ' + score1 + " : " + score2;
        waitTwoSec = true;
    console.log(" goalscored1 received speed: ", puckD)
    scoreText2.text = (400*sizer, 300, "   GOAL!!!!");
    scoreText3.text = (700*sizer, 500, puckD + " km/h");
    }
    fx.play();

}

function updateScore2(puckD)
{
    if (waitTwoSec === false){
        score2++;
        scoreText.text = 'Score : ' + score1 + " : " + score2;
        waitTwoSec = true;
        console.log(" goalscored1 received speed: ", puckD)
        scoreText2.text = (400*sizer, 400, "   GOAL!!!!");
        scoreText3.text = (700*sizer, 500, puckD + " km/h");
    }
    fx.play();

}

function finalScore(){
        if (score1 > score2){
            scoreText2.text = (400, 400, "Player1 WINS!");
        }
        else if (score2 > score1){
            scoreText2.text = " Player2 WINS!";
            //gameEnd = true;
        }
        else{
            scoreText2.text = " DRAW ";
        }
        _this.game.paused = true;
}