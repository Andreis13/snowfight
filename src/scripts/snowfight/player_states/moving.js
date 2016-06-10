
var PlayerState = require('./base.js');


var MovingState = function (player) {
  PlayerState.call(this, player);
}

MovingState.prototype = new PlayerState();
MovingState.prototype.constructor = MovingState;

MovingState.prototype.handleInput = function (controller) {
  var p = new Phaser.Point(controller.trackball.x, controller.trackball.y);
  var p_rotated = Phaser.Point.rotate(p, 0, 0, -45, true);

  var v = p_rotated.multiply(this.player.speed_multiplier, this.player.speed_multiplier);

  if (v.getMagnitudeSq() > 0) {
    this.player.startMoving(v);
  } else {
    this.player.stopMoving();
  }

  if (controller.button_a_pressed()) {
    this.player.states.start('throwing_snowball');
    // if (this.player.hasSnowball()) {
    //   console.log('before throw')
    //   this.player.states.start('throwing_snowball');
    // } else {
    //   this.player.states.start('preparing_snowball');
    // }
  }

  if (controller.button_b_pressed()) {
    this.player.states.start('throwing_snowball');
  }
}

MovingState.prototype.exit = function () {
  this.player.stopMoving();
}


module.exports = MovingState;
