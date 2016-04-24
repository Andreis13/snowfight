
var PlayerState = require('./base.js');



var DisabledState = function (player) {
  PlayerState.call(this, player);
}

DisabledState.prototype = new PlayerState();
DisabledState.prototype.constructor = DisabledState;

DisabledState.prototype.enter = function () {
  this.player.name = 'Disabled';
  this.player.sprite.body.velocity.x = 0;
  this.player.sprite.body.velocity.y = 0;
  this.player.sprite.body.velocity.z = 0;
  this.player.sprite.body.immovable = true;
  this.player.sprite.body.allowGravity = false;
}


module.exports = DisabledState;
