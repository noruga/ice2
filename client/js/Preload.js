FunkyMultiplayerGame.Preload = function () {
};

FunkyMultiplayerGame.Preload.prototype = {

    preload: function () {
        this.load.image("btn-join-game",    'assets/btn-join-game.png');
        this.load.image("red-fly",          'assets/red-fly.png');

		this.load.image('starfield' , "assets/rink old.png");
		this.load.image('ball', "assets/ball1.png");
        this.load.image('ball1m', "assets/ball1m.png");
		this.load.image('stick', "assets/stick.png");
        this.load.image('goalshort', "assets/goalshort.png");
        this.load.image('goallong1', "assets/goallong1.png");
        this.load.image('goallong2', "assets/goallong2.png");
        //game.load.image('goallong', "assets/goallong.png");
        this.load.image('goalsensor', "assets/goalsensor.png");
        this.load.image('cornerRec', "assets/cornerRec.png");
        this.load.image('goalarea', "assets/goalarea.png");
        //this.load.audio('sfx', [ 'assets/goalsound.mp3', 'assets/goalsound.ogg' ]);
    
    },

    create: function () {
        this.state.start("Menu");
        console.log("DONE!");
    }
};
