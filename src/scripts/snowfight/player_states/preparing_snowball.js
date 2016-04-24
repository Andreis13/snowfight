
var PlayerState = require('./base.js');


var PreparingSnowballState = function (player) {
  PlayerState.call(this, player);
}

PreparingSnowballState.prototype = new PlayerState();
PreparingSnowballState.prototype.constructor = PreparingSnowballState;

PreparingSnowballState.prototype.enter = function () {
  this.start_time = Date.now();
}

PreparingSnowballState.prototype.update = function () {
  if (Date.now() - this.start_time > 2000) { // 2 seconds for preparing a snowball
    this.player.addSnowball();
    this.player.states.start('moving');
  }
}

module.exports = PreparingSnowballState;
