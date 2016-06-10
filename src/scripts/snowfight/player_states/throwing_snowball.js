
var PlayerState = require('./base.js');

var ThrowingSnowballState = function (player) {
  PlayerState.call(this, player);
}

ThrowingSnowballState.prototype = new PlayerState();
ThrowingSnowballState.prototype.constructor = ThrowingSnowballState;

ThrowingSnowballState.prototype.enter = function () {
  this.start_time = Date.now();
  this.max_charge_period = 2000; // miliseconds
}

ThrowingSnowballState.prototype.handleInput = function (controller) {

  // COPY-PASTE from MovingState to test throwing while moving
  var p = new Phaser.Point(controller.trackball.x, controller.trackball.y);
  var p_rotated = Phaser.Point.rotate(p, 0, 0, -45, true);

  var v = p_rotated.multiply(this.player.speed_multiplier, this.player.speed_multiplier);

  if (v.getMagnitudeSq() > 0) {
    this.player.startMoving(v);
  } else {
    this.player.stopMoving();
  }
  // END COPY-PASTE


  if (controller.button_a_released()) {
    this.player.throwSnowball(this.getForceMultiplier());
    this.player.states.start('moving');
  }
}

ThrowingSnowballState.prototype.update = function () {

}

ThrowingSnowballState.prototype.getForceMultiplier = function () {
  var ratio = (Date.now() - this.start_time) / this.max_charge_period;
  return Math.min(ratio, 0.7) + 0.3;
}

module.exports = ThrowingSnowballState;
