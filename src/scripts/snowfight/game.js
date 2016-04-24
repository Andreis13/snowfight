
var Preload = require('./game_states/preload.js');
var Play = require('./game_states/play.js');

var Game = function (width, height, connections) {
  this.game = new Phaser.Game(width, height, Phaser.AUTO, '');
  this.game.state.add('preload', new Preload());
  this.game.state.add('play', new Play(connections));
}

Game.prototype.start = function () {
  this.game.state.start('preload');
}

module.exports = Game;
