
var Controller = require('./base.js');

var LocalController = function (phaser_input) {
  Controller.call(this);

  this.cursors = phaser_input.keyboard.createCursorKeys();
  this.a_key = phaser_input.keyboard.addKey(Phaser.KeyCode.A);
  this.b_key = phaser_input.keyboard.addKey(Phaser.KeyCode.B);
}
LocalController.prototype = new Controller();
LocalController.prototype.constructor = LocalController;

LocalController.prototype.update = function () {
  var v = { x: 0, y: 0 };
  if (this.cursors.up.isDown) {
    v.y -= 50;
  }

  if (this.cursors.down.isDown) {
    v.y += 50;
  }

  if (this.cursors.left.isDown) {
    v.x -= 50;
  }

  if (this.cursors.right.isDown) {
    v.x += 50;
  }
  this.trackball = v;

  this.button_a_down = this.a_key.isDown
  this.button_b_down = this.b_key.isDown
}


LocalController.prototype.feedback = function () {
  console.log('local feedback');
}

module.exports = LocalController;

