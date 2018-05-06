var game = new Phaser.Game(1080, 600, Phaser.CANVAS, 'gamediv');

//var SETTINGS = require("./SETTINGS.js");


var sprite;
var bmd, bmd1, bmd2;
var stick, stick1, stickm, stick1m;
var bounds;
var puck;
var player, player1, player2, player3;
var goal1, goal2, goal3, goal4, goal5, goal6;
var score1 = 0;
var score2 = 0;
var goalsensor1, goalsensor2;
var scoreString;
var goalscored = false;
var waitTwoSec = false;
var waitSecs = 0;
var shotpause = 0;
var shotpause1 = 0;
var scoreText1, scoreText2, scoreText3;
var gameEnd = false;
var goalarea1, goalarea2;
var areaSecs1 = 0;
var areaSecs2 = 0;
var n_count = 0;
var m_count = 0;
var fx, fx1 //, slide;
var controlled = true;
var target;
var homePoint, homePoint1;
var forwPoint, forwPoint1;
var puck1;
var sizer;
var goalFrameCounter = 1;
var puckCoordX = 540;
var puckCoordY = 300;

var accelerateRemote = true;
//var cornerRec;





var mainState = {
	preload: function(){

		game.load.image('starfield' , "assets/rinknew.png");
		game.load.image('ball', "assets/ball1.png");
        game.load.image('ball1m', "assets/ball1m.png");
		game.load.image('stick', "assets/stick.png");
        game.load.image('goalshort', "assets/goalshort.png");
        game.load.image('goallong1', "assets/goallong1.png");
        game.load.image('goallong2', "assets/goallong2.png");
        //game.load.image('goallong', "assets/goallong.png");
        game.load.image('goalsensor', "assets/goalsensor.png");
        game.load.image('cornerRec', "assets/cornerRec.png");
        game.load.image('goalarea', "assets/goalarea.png");
        game.load.audio('sfx', [ 'assets/goalsound.mp3', 'assets/goalsound.ogg' ]);
        game.load.audio('hit', 'assets/hit.mp3');
        //game.load.audio('hit1', [ 'assets/hit1.ogg']);
        //game.load.audio('slide', 'assets/slide.mp3');
        //game.load.audio('sfx1', [ 'assets/Guards.mp3']);
        //game.load.audio('sfx', "assets/goalsound.ogg");
        //game.load.audiosprite('sfx', 'assets/Goal Sound.mp3', null, audioJSON);
	},

	create: function(){

        var SETTINGS = {

            SHOOT_FOREH : 1000,
            SHOOT_BACKH : 1000,
            FORWARD : 500,
            BACKWARD : 300,
            DISTANCE : 30,
            ROTATE : 1000,
            BRAKE : 0.9,
            BRAKE_ATTR : 30,
            PLAYER_FRICTON : 0.99,
            PUCK_FRICTION : 0.995,
            PUCK_MASS : 0.00001
        };
        sizer = 1.2;
        fx = game.add.audio('sfx');
        fx1 = game.add.audio('hit');
        fx2 = game.add.audio('hit1');
        //slide = game.add.audio('slide');
        //fx1 = game.add.audio('sfx1');
        //var sound = game.sound.play('sfx1');
        //fx.play();

        cursors = game.input.keyboard.createCursorKeys();





        var spacefield = game.add.tileSprite(0,0,1080,600, 'starfield');
        game.physics.startSystem(Phaser.Physics.P2JS);
        //game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.p2.restitution = 0.1;


        

        //game.physics.p2.setImpactEvents(true);
        var stickCollisionGroup = game.physics.p2.createCollisionGroup();
        var puckCollisionGroup = game.physics.p2.createCollisionGroup();
        var goalsensorGroup = game.physics.p2.createCollisionGroup();

        game.time.events.add(Phaser.Timer.SECOND * 150, finalScore, this);




        //############ The Corners ##############
        var cornerRec = game.add.sprite(882 *sizer, 595, 'cornerRec');
        cornerRec.angle = -45;
        game.physics.p2.enable(cornerRec);
        //cornerRec.angle = -45;
        //game.physics.enable(cornerRec, Phaser.Physics.ARCADE);
        cornerRec.body.static = true;
        cornerRec.body.collideWorldBounds = false;
        cornerRec.body.setCollisionGroup(puckCollisionGroup);
        cornerRec.body.collides([puckCollisionGroup]) ; 
        
        
        var cornerRec1 = game.add.sprite(882*sizer, 5, 'cornerRec');
        cornerRec1.angle = 45;
        game.physics.p2.enable(cornerRec1);
        //cornerRec.angle = -45;
        //game.physics.enable(cornerRec, Phaser.Physics.ARCADE);
        cornerRec1.body.static = true;
        cornerRec1.body.collideWorldBounds = false;
        cornerRec1.body.setCollisionGroup(puckCollisionGroup);
        cornerRec1.body.collides([puckCollisionGroup]) ;

        var cornerRec2= game.add.sprite(0, 12, 'cornerRec');
        cornerRec2.angle = -45;
        game.physics.p2.enable(cornerRec2);
        //cornerRec.angle = -45;
        //game.physics.enable(cornerRec, Phaser.Physics.ARCADE);
        cornerRec2.body.static = true;
        cornerRec2.body.collideWorldBounds = false;
        cornerRec2.body.setCollisionGroup(puckCollisionGroup);
        cornerRec2.body.collides([puckCollisionGroup]) ; 

        var cornerRec3 = game.add.sprite(0, 585, 'cornerRec');
        cornerRec3.angle = 45;
        game.physics.p2.enable(cornerRec3);
        cornerRec3.body.static = true;
        cornerRec3.body.collideWorldBounds = false;
        cornerRec3.body.setCollisionGroup(puckCollisionGroup);
        cornerRec3.body.collides([puckCollisionGroup]);
        
        cornerRec3.visible = false;

        cornerRec.visible = false;
        cornerRec1.visible = false;
        cornerRec2.visible = false;

        //###### End Corners ############



        homePoint = game.add.sprite(112*sizer, 319, null);
        homePoint1  = game.add.sprite(788*sizer, 281, null);

        forwPoint  = game.add.sprite(720*sizer, 100, null);
        forwPoint1  = game.add.sprite(720*sizer, 500, null);
 


        player = new Player(game, 150*sizer, 200, 'ball') ;
        player.body.setCollisionGroup(puckCollisionGroup);
        player.body.collides([puckCollisionGroup]) ;
        //player.body.collides([ puckCollisionGroup]) ;
        player.body.angle = 70;
        //player.body.angle = 45;
        
        player.stick1.body.setCollisionGroup(stickCollisionGroup);
        player.stick1.body.collides(puckCollisionGroup);

        player1 = new Player(game, 150*sizer, 400, 'ball');
        player1.body.setCollisionGroup(puckCollisionGroup);
        //player1.body.collides(stickCollisionGroup);
        player1.body.collides([ puckCollisionGroup]) ;
        //player1.body.collides([stickCollisionGroup, puckCollisionGroup]) ;
        player1.body.angle = 70;

        player1.controlPlayer = false;
        
        player1.stick1.body.setCollisionGroup(stickCollisionGroup);
        player1.stick1.body.collides(puckCollisionGroup);
        //player1.body.angle = -45;
        //player1.body.rotateRight = 300;

        player2 = new Player(game, 750*sizer, 200, 'ball1m');
        player2.body.setCollisionGroup(puckCollisionGroup);
        //player2.body.collides(stickCollisionGroup);
        player2.body.collides([ puckCollisionGroup]) ;

        player2.body.angle = -70;

        player2.controlPlayer = false;
        
        player2.stick1.body.setCollisionGroup(stickCollisionGroup);
        player2.stick1.body.collides(puckCollisionGroup);
        player2.gohome =false;




        player3 = new Player(game, 750*sizer, 400, 'ball1m');
        player3.body.setCollisionGroup(puckCollisionGroup);
        //player3.body.collides(stickCollisionGroup);
        player3.body.collides([ puckCollisionGroup]) ;
        //player3.body.collides([stickCollisionGroup, puckCollisionGroup]) ;
        player3.body.angle = -70;

        player3.controlPlayer = false;
        
        player3.stick1.body.setCollisionGroup(stickCollisionGroup);
        player3.stick1.body.collides(puckCollisionGroup);


        player3.gohome = false;


    scoreString = 'Score : ';
    scoreText = game.add.text(322*sizer, 10, scoreString + score1 + " : " + score2, { font: '34px Arial', fill: '#bbf' });
    scoreText1 = game.add.text(1, 10, "Time : " + game.time.events.duration/60, { font: '34px Arial', fill: '#bbf' });
    scoreText2 = game.add.text(200*sizer, 300, "" ,{ font: '100px Arial', fill: '#bbf' });
    scoreText3 = game.add.text(200*sizer, 500, "" ,{ font: '100px Arial', fill: '#bbf' });
   
    //var puck1 = new Puck(game, 200, 50);


        // #############THE PUCK#######################
        bmd = game.add.bitmapData(15, 15, 'rgb(0,200,0)');
        bmd.circle(7, 7, 6, 0);
        puck = game.add.sprite(450*sizer, 300, bmd);
        game.physics.p2.enable(puck);
        puck.body.setCircle(7);
        puck.body.mass = SETTINGS.PUCK_MASS;
        //game.physics.enable(puck, Phaser.Physics.ARCADE);
    

        puck.body.collideWorldBounds = true;
     
        puck.body.setCollisionGroup(puckCollisionGroup);
        puck.body.collides([stickCollisionGroup, puckCollisionGroup]);

        puck.body.lastX = 450*sizer;
        puck.body.lastY = 300;
        

        target = game.add.sprite(450*sizer, 400, bmd);
        game.physics.p2.enable(target);
        target.body.setCircle(7);
        target.visible = false;
        //target.body.collideWorldBounds = true;
    
    //puck1 = new Puck(game, 200*sizer, 50);
/*
    puck1.body.setCollisionGroup(puckCollisionGroup);
    puck1.body.collides([stickCollisionGroup, puckCollisionGroup]);*/


        // #############The Goals#################
        goal6 = game.add.sprite(844*sizer, 297, 'goallong2');
        goal3 = game.add.sprite(56*sizer, 298, 'goallong1');

        goal1 = game.add.sprite(67*sizer, 247, 'goalshort');
        goal2 = game.add.sprite(67*sizer, 350, 'goalshort');
        


        goal4 = game.add.sprite(832*sizer, 247, 'goalshort');
        goal5 = game.add.sprite(832*sizer, 350, 'goalshort');
        

        goalsensor1 = game.add.sprite(60*sizer, 259, 'goalsensor');
        goalsensor2 = game.add.sprite(837*sizer, 259, 'goalsensor');
        goalsensor1.visible = false;
        goalsensor2.visible = false;

        goalarea1 = game.add.sprite(81*sizer, 241, 'goalarea');
        goalarea2 = game.add.sprite(774*sizer, 241, 'goalarea');
        goalarea1.visible = false;
        goalarea2.visible = false;
        goalarea1.anchor.setTo(0.5, 0.5);

        game.physics.p2.enable([goal1, goal2, goal3, goal4, goal5, goal6]);


        goal1.body.setCollisionGroup(puckCollisionGroup);
        goal2.body.setCollisionGroup(puckCollisionGroup);
        goal3.body.setCollisionGroup(puckCollisionGroup);
        goal4.body.setCollisionGroup(puckCollisionGroup);
        goal5.body.setCollisionGroup(puckCollisionGroup);
        goal6.body.setCollisionGroup(puckCollisionGroup);
        goal1.body.collides([puckCollisionGroup]) ;     //
        goal2.body.collides([puckCollisionGroup]) ;
        goal3.body.collides([puckCollisionGroup]) ;
        goal4.body.collides([puckCollisionGroup]) ;
        goal5.body.collides([puckCollisionGroup]) ;
        goal6.body.collides([puckCollisionGroup]) ;

        game.physics.p2.enable( [ goal1, goal2, goal3, goal4, goal5, goal6]);
            goal1.body.static = true;
            goal2.body.static = true;
            goal3.body.static = true;
            goal4.body.static = true;
            goal5.body.static = true;
            goal6.body.static = true;

        game.physics.p2.updateBoundsCollisionGroup();



	},

	update: function(){
            //sprite.body.velocity.x = 0;
    //sprite.body.velocity.y = 0;
    goalFrameCounter++;
    scoreText1.text =  " Time : "+ Math.floor(game.time.events.duration/1000);
/*
    var puckX = puck.x;
    var puckY = puck.y;
*/
    

        if (waitTwoSec == true){
            waitSecs++;
            if (waitSecs == 180){
                puck.reset(450*sizer, 300);
            }
            else if (waitSecs > 180){
                goalscored = false;                     //goals will again be counted
                waitTwoSec = false;                     //the two secs are over
                waitSecs = 0;
                scoreText2.text = (600, 400, " ");
                scoreText3.text = (600, 400, " ");     //Erases the 'GOAL!!!'
            }

        };

    if (accelerateRemote){
        if ((game.physics.arcade.distanceBetween(puck, player2)) < (game.physics.arcade.distanceBetween(puck, player3))){
            target.body.x = puckTargetPosX(player2, puck);
            target.body.y = puckTargetPosY(player2, puck);
            player3.gohome = true;
            player2.gohome = false;
            accelerateToPoint(player2, target, 450);
            if (game.physics.arcade.distanceBetween(puck, player2.stick1) < 0){
                moveToObject(puck, player2.stick1, 30);
            }
            else
                accelerateToPoint(player2, puck, 450);
            //if (game.physics.arcade.distanceBetween(puck, player3) < 35)
            //    brake(player2);
        }
        else{
            target.body.x = puckTargetPosX(player3, puck);
            target.body.y = puckTargetPosY(player3, puck);
            player2.gohome = true;
            player3.gohome = false;
            accelerateToPoint(player3, target, 450);
            if (game.physics.arcade.distanceBetween(target, player3.stick1) < 0){
                moveToObject(puck, player3.stick1, 30);
            }
            /*
            else (game.physics.arcade.distanceBetween(target, player2.stick1) >= 15){
                accelerateToPoint(player3, puck, 450);
            */
            //if (game.physics.arcade.distanceBetween(puck, player3) < 35)
            //    brake(player3);
        }
        if (target.body.x < 0 || target.body > 900)
            target.body.x = puck.body.x;                //keeps target inside canvas
        if (target.body.y < 0 || target.body > 600)
            target.body.y = puck.body.y;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.N)){
        if (player.controlPlayer){
            player1.gohome = false;
            player1.goforw = false;
            if (n_count == 0){
                player.controlPlayer = false;
                player1.controlPlayer = true;
                
            }
        }
        
        else if (player1.controlPlayer){
            player.gohome = false;
            player.goforw = false;
            if (n_count == 0){

                player.controlPlayer = true;
                player1.controlPlayer = false;

            }
        }
        n_count++;
    }
    if (n_count > 0)
        n_count++;
    
    if (n_count >= 30){
        n_count = 0;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.M) || game.input.keyboard.isDown(Phaser.Keyboard.COMMA) ){
        m_count++;
    }
    else{
        if (m_count >= 20){
            if (player.controlPlayer){
                player.goforw = true;
                player.gohome = false;
            }
            else{
                player1.goforw = true;
                player1.gohome = false;
            }
        }
        if (m_count > 0 && m_count < 20){
            if (player.controlPlayer)
                player.gohome = true;
            else
                player1.gohome = true;  
        }
        m_count = 0;

    }

/*
    //########### To check if player is in keeper's area. ########
    if (checkOverlap(sprite, goalarea1)){
        areaSecs1++;
    }
    else
        areaSecs1 = 0;

    if (areaSecs1 >= 120){
        //updateScore2();
        areaSecs1 = 0;
        //sprite.reset(750, 300)
    }
    if (checkOverlap(sprite1, goalarea2)){
        areaSecs2++;
    }
    else
        areaSecs2 = 0;

    if (areaSecs2 >= 120){
        //updateScore1();
        areaSecs2 = 0;
    }
*/

    if (player.goforw){
        //player.gohome = false;
        if (player1.y < 301)
            goHome(player1, forwPoint);
        else
            goHome(player1, forwPoint1);

        if (player1.x >= forwPoint.x - 130){
            player1.body.velocity.x *= 0.9;
            player1.body.velocity.y *= 0.9;
            if (player1.y < 300){
                player1.body.angle = 180;
            }
            else
                player1.body.angle = 0;

        }
        //if (checkOverlap(player, goalarea1))
            //player1.gohome = false;
    }
    else if (player1.goforw){
        //player1.gohome = false;
        if (player.y < 301)
            goHome(player, forwPoint);
        else
            goHome(player, forwPoint1);

        if (player.x >= forwPoint.x - 130){
            player.body.velocity.x *= 0.9;
            player.body.velocity.y *= 0.9;
            if (player.y < 300){
                player.body.angle = 180;
            }
            else
                player.body.angle = 0;
        }
        //if (checkOverlap(player1, goalarea1))
            //player.gohome = false;
    }




    if (player1.gohome){
        player1.goforw = false;
        goHome(player, homePoint);
        if (player.x <= homePoint.x)
            player.angle = 90;

        //if (checkOverlap(player, goalarea1))
            //player1.gohome = false;
    }
    else if (player.gohome){
        player.goforw = false;
        goHome(player1, homePoint);

        if (player1.x <= homePoint.x)
            player1.angle = 110;
        //if (checkOverlap(player1, goalarea1))
            //player.gohome = false;
    }
    if (player2.gohome){
        player3.gohome = false;
        goHome(player2, homePoint1);
        //accelerateToPoint(player3, puck);
    }
    else if (player3.gohome){
        player2.gohome = false;
        goHome(player3,  homePoint1);
        //accelerateToPoint(player2, puck);
    }


    puck.body.velocity.x = puck.body.velocity.x * 0.995;        //the puck has even less friction
    puck.body.velocity.y = puck.body.velocity.y * 0.995;


    //if (target.x < 0 || target.x > 900 || target.y < 0 || target.y > 600)
    
    

    if (goalscored == false){                   //to register goal only once
        //if(puck.prevx < )
        if (checkOverlap(puck, goalsensor1))
        {
            if ((puck.body.lastX < 65*sizer) || ((puck.body.lastY < 242)) || puck.body.lastY > 358 ){
            
                puck.body.x = puck.body.lastX;
                puck.body.y = puck.body.lastY;
            }
            else{
                updateScore2();
                goalscored = true;
                puck.body.velocity.x = puck.body.velocity.x * 0.01;
                puck.body.velocity.y = puck.body.velocity.y * 0.01;
            }
        };

        if (checkOverlap(puck, goalsensor2))
        {
            if ((puck.body.lastX > 837*sizer) || ((puck.body.lastY < 242)) || puck.body.lastY > 358 )
            {
                puck.body.x = puck.body.lastX;
                puck.body.y = puck.body.lastY;
            }
            else{
                updateScore1();
                goalscored = true;
                puck.body.velocity.x = puck.body.velocity.x * 0.01;
                puck.body.velocity.y = puck.body.velocity.y * 0.01;
            }
        };
    };

    puck.body.lastX = puck.body.x;
    puck.body.lastY = puck.body.y;


  /*
    if (game.input.keyboard.isDown(Phaser.Keyboard.M))
    {
        accelerateRemote = true;
        //turnToDegr(sprite.body.rotation);
        //accelerateToPoint(sprite, 720, 500, 450);
    }
      if (accelerateRemote)
        accelerateToPoint(sprite, puck, 450);
*/
}


}



function render() {
    //game.debug.soundInfo(sound, 232, 232);

//game.debug.text("Time until event: " + game.time.events.duration, 232, 32, { font: '34px Arial', fill: '#bbf' });
}
/*
function accelerateToPoint(obj1, obj2, speed) {

    //var x = Math.cos(obj1.angle) * 20 + obj1.x;
    //var y = Math.sin(obj1.angle) * 20 + obj1.y;

    var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
    obj1.body.rotation = angle + game.math.degToRad(90); 
    obj1.body.force.x = Math.cos(angle) * speed;    // accelerateToObject 
    obj1.body.force.y = Math.sin(angle) * speed;
}
*/


function accelerateToPoint(obj1, obj2, speed) {

    var angle = game.physics.arcade.angleBetween(obj1, obj2);

    //var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x) + game.math.degToRad(90);

    var x1 = Math.cos(angle) * (-55) + obj2.x;
    var y1 = Math.sin(angle) * (-55) + obj2.y;


    //point.rotate(x1, y1, angle, true, 90);


    var angle1 = Math.atan2(y1 - obj1.y, x1 - obj1.x);
    //obj1.rotation = angle + game.math.degToRad(90);

    if (checkOverlap(obj1, goalarea1)){
        obj1.body.rotation = -80;
        obj1.body.velocity.x *= 0.95;
        obj1.body.velocity.y *= 0.95;
    }
    else if (checkOverlap(obj1, goalarea2)){
        obj1.body.rotation = 80;
        obj1.body.velocity.x *= 0.95;
        obj1.body.velocity.y *= 0.95;
    }
    else if (game.physics.arcade.distanceBetween(obj1, obj2) > 30)
        obj1.body.rotation = angle + game.math.degToRad(90); 
    obj1.body.force.x = Math.cos(angle) * speed;    // accelerateToObject 
    obj1.body.force.y = Math.sin(angle) * speed;

    //if(obj1.)
}


function moveToObject(obj1, obj2, speed1) {
    //if (typeof speed1 === 'undefined') { speed1 = 60; }
    //obj2.x -= 18;
    //obj2.y += 21;
    //obj1.body.anchor = 0.75, 0.75;
    var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
    obj1.body.rotation = angle + game.math.degToRad(90);  //
    obj1.body.velocity.x = Math.cos(angle) * speed1;    // accelerateToObject 
    obj1.body.velocity.y = Math.sin(angle) * speed1;
}


function brake(player){
        player.body.velocity.x *= 0.9;                  //slows down by 10% every frame
        player.body.velocity.y *= 0.9;

        if (game.physics.arcade.distanceBetween(puck, player.stick1) < 22.15) {
                moveToObject(puck, player.stick1, 100);
        }
}


function finalScore(){
//    scoreText1.text = ('You win!', { font: '34px Arial', fill: '#bbf' });
        //fx2.play();

        if (score1 > score2){
            scoreText2.text = (400, 400, "Player1 WINS!");
        }
        else if (score2 > score1){
            scoreText2.text = " Player2 WINS!";
            //gameEnd = true;
        }
        else{
            scoreText2.text = " DRAW ";
        
            //gameEnd = true;
        }
        //game.paused = true;
}


function puckTargetPosX(player, puck){
    var angle = game.physics.arcade.angleBetween(player, puck) + game.math.degToRad(90);

    //var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x) + game.math.degToRad(90);


    var x1 = Math.cos(angle) * (25) + puck.x;
    //var y1 = Math.sin(angle) * (25) + puck.y;
    return x1;

}


function puckTargetPosY(player, puck){
    var angle = game.physics.arcade.angleBetween(player, puck) + game.math.degToRad(90);

    //var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x) + game.math.degToRad(90);


    //var x1 = Math.cos(angle) * (25) + puck.x;
    var y1 = Math.sin(angle) * (25) + puck.y;
    return y1;

}
function goHome(player, homePoint){
    accelerateToPoint(player, homePoint, 400);
    /*if (checkOverlap(player, goalarea1)){
        //player.angle = -70;
    }*/
}


function updateScore1()
{
    score1++;
    scoreText.text = scoreString + score1 + " : " + score2;
    waitTwoSec = true;

    let puckDist = Math.sqrt((puckCoordX - puck.body.x)*(puckCoordX - puck.body.x) + (puckCoordY - puck.body.y)*(puckCoordY - puck.body.y));
    scoreText2.text = (400*sizer, 300, "   GOAL!!!!");
    scoreText3.text = (500*sizer, 500, Math.floor((puckDist * 40 * 60 * 3.6)  / (goalFrameCounter * 1080)) + " km/h");
    // puckDist * 

/*
    player.body.x = 150;
    player.body.y = 200;
    player1.body.x = 150;
    player1.body.y = 400;
    player.body.velocity.x = 0;
    player1.body.velocity.x = 0;
    player3.body.velocity.x = 0;
    player2.body.velocity.x = 0;+*/
    fx.play();
    //sound.play();
}

function updateScore2()
{
    score2++;
    scoreText.text = scoreString + score1 + " : " + score2;
    waitTwoSec = true;
    //scoreText2.text = (400*sizer, 300, "   GOAL!!!!");
    let puckDist =  Math.sqrt((puckCoordX - puck.body.x)*(puckCoordX - puck.body.x) + (puckCoordY - puck.body.y)*(puckCoordY - puck.body.y));
    scoreText2.text = (400*sizer, 300, "   GOAL!!!!");
    scoreText3.text = (500*sizer, 500, Math.floor((puckDist * 40 * 60 * 3.6)   / (goalFrameCounter * 1080)) + " km/h");

/*
    player.body.x = 150;
    player.body.y = 200;
    player1.body.x = 150;
    player1.body.y = 400;
    player.body.velocity.x = 0;
    player1.body.velocity.x = 0;
    player3.body.velocity.x = 0;
    player2.body.velocity.x = 0;
*/

    //fx.play('sfx');
    fx.play();
    //sound.play();
}

function checkOverlap(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();
    return Phaser.Rectangle.intersects(boundsA, boundsB);

}


Player = function (game, x, y, img) {

    Phaser.Sprite.call(this, game, x, y, img);

        this.gohome = false;
        this.goforw = false;

        game.physics.p2.enable(this);
        this.body.setCircle(15);
        this.anchor.setTo(0.5, 0.5);
        this.controlPlayer = true;
        this.accelerateRemote = false;
        // ####This stick is invisible, without collision###############
        this.stick = game.add.sprite(x, y, null);

        // #####This stick1 is visible, collides with puck###################
        this.stick1 = game.add.sprite(x, y, 'stick');
        //stick1.anchor.setTo(0, 1);
        game.physics.p2.enable(this.stick);
        game.physics.p2.enable(this.stick1);
        this.stick.body.clearCollision(true);
        this.stick1.body.collideWorldBounds = false;

        var constraint = game.physics.p2.createLockConstraint(this, this.stick, [-30, 0], 0);
        var constraint1 = game.physics.p2.createLockConstraint(this, this.stick1, [30, 0], 0);

    game.add.existing(this);

};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){
if(!this.controlPlayer){
    this.body.velocity.x *= 0.99;
    this.body.velocity.y *= 0.99;
}
else{
    this.body.velocity.x *= 0.94;
    this.body.velocity.y *= 0.94;
}



    this.body.angularVelocity = 0;


    if (this.controlPlayer == true){
    if (game.input.keyboard.isDown(Phaser.Keyboard.A) || cursors.left.isDown){
        this.body.rotateLeft(125);
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.D)|| cursors.right.isDown){
        this.body.rotateRight(125);
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.W)|| cursors.up.isDown){
        if ((this.body.velocity.x * this.body.velocity.x) + (this.body.velocity.y * this.body.velocity.y) > 25000)
            this.body.thrust(1500);
        else{
            this.body.thrust(3000);
            //slide.play();
        }
    }
    if(game.input.keyboard.isDown(Phaser.Keyboard.S)|| cursors.down.isDown){
        this.body.reverse(500);
    }

    if(game.input.keyboard.isDown(Phaser.Keyboard.V)){
        brake(this);
/*
        this.body.velocity.x *= 0.9;
        this.body.velocity.y *= 0.9;

        if (game.physics.arcade.distanceBetween(puck, this.stick1) < 20) {
                moveToObject(puck, this.stick1, 30);
        }*/
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.B)){
        if (checkOverlap(this.stick1, puck)){
            fx1.play();
            goalFrameCounter = 1;
            puckCoordX = puck.body.x;
            puckCoordY = puck.body.y;
        }


        if (game.input.keyboard.isDown(Phaser.Keyboard.A)|| cursors.left.isDown){
            //if (controlPlayer1){
                if (shotpause1 < 12){
                    this.body.rotateLeft(1200);
                    shotpause1++;   
                }
                
                else
                    shotpause1 = 0;
        }

            
    
        else{
            //if (controlPlayer1){
            if (shotpause1 < 12){
                this.body.rotateRight(1200);
                shotpause1++;   
        }
                
        else
            shotpause1 = 0;
        }
            
    }
}

};

Puck = function(game, x, y){

    // #############THE PUCK#######################



    var bmd1 = game.add.bitmapData(15, 15, 'rgb(0,200,0)');
    bmd1.circle(7, 7, 6, 0);
    Phaser.Sprite.call(this, game, x, y, bmd1);
    
/*
    game.physics.p2.enable(this);
    this.body.setCircle(7);
    //this.body.mass = 0.00001;
        //puck.visible = false;
        //game.physics.enable(puck, Phaser.Physics.ARCADE);


    //this.body.collideWorldBounds = true;
    this.body.clearCollision(true);*/
/*
    this.body.setCollisionGroup(puckCollisionGroup);
    this.body.collides([stickCollisionGroup, puckCollisionGroup]);*/

    this.target_x = 450;
    this.target_y = 300;

    game.add.existing(this);

}
Puck.prototype             = Object.create(Phaser.Sprite.prototype);
Puck.prototype.constructor = Puck;



game.state.add('mainState', mainState);

game.state.start('mainState');