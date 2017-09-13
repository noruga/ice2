
(function () {
    var game = new Phaser.Game(900, 600, Phaser.AUTO, 'gameContainer', null, false, false);

    game.state.add('Boot',          FunkyMultiplayerGame.Boot);
    game.state.add('Preload',       FunkyMultiplayerGame.Preload);
    game.state.add('Menu',          FunkyMultiplayerGame.Menu);
    game.state.add('Game',          FunkyMultiplayerGame.Game);

    game.state.start('Boot');
    game.stage.disableVisibilityChange = true;
})();