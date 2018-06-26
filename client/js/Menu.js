var _this;
var getPlayers = [];
var input;
var count = 0;
var player = "def"

/*
socket.on('how_are_you', function(data){
	getPlayers[count] = data;
	count++;
	console.log("receiving data: ", data)
});*/


FunkyMultiplayerGame.Menu = function () {
};

FunkyMultiplayerGame.Menu.prototype = {

    create: function () {
    	_this = this;
    	//this.add.plugin(PhaserInput.Plugin);
    	//input = this.game.add.inputField(500, 90);
/*		var player = prompt("Please enter your name", "");*/
		//socket.emit('change_username', player)
    	this.textMsg = this.add.text(470, 100, " " , { font: '80px Arial', fill: '#cc0000' });
        // This button will cause the 'join_game' event to be emitted.
        this.add.button(150, 80, 'btn-join-game', this.joinGamePressed, this);
        this.game.stage.disableVisibilityChange = true;

    },
    update: function () {

    },

    joinGamePressed: function () {
        socket.emit('join_game', player);
        this.textMsg.text = "waiting for"
        textMsg = this.add.text(470, 300, " another player ", { font: '80px Arial', fill: '#cc0000' });
    }
};


