
var Utils = require('./utils.js');

var PlayerState = require('./player_states/base.js');

var PlayerStateManager = function (player) {
  this.player = player;
  this.states = {};
  this.current = new PlayerState();
}

PlayerStateManager.prototype.add = function (name, state_class) {
  this.states[name] = state_class;
}

PlayerStateManager.prototype.start = function (name) {
  this.current.exit();
  this.current = new this.states[name](this.player);
  this.current.enter();
}


var Player = function (game, sprite, controller) {
  this.direction = 'south_east';
  this.equipped_snowball_count = 0;
  this.health_points = 100;
  if (controller.connection && controller.connection.metadata) {
    this.name = controller.connection.metadata.player_name || 'Test Player';
  } else {
    this.name = 'Test Player';
  }


  // Setup Phaser stuff
  this.sprite = sprite;
  this.sprite.player = this; // create a back-reference
  this.game = game;
  this.controller = controller;

  this.states = new PlayerStateManager(this);
  this.states.add('moving', require('./player_states/moving.js'));
  this.states.add('preparing_snowball', require('./player_states/preparing_snowball.js'));
  this.states.add('throwing_snowball', require('./player_states/throwing_snowball.js'));
  this.states.add('disabled', require('./player_states/disabled.js'));

  this.states.start('moving');
}

Player.prototype.update = function () {
  // TODO: find a more elegant way to do this
  if (this.controller.update) {
    this.controller.update();
  }

  this.states.current.handleInput(this.controller);
  this.states.current.update();
}

Player.prototype.render = function () {
  var position = this.sprite.body.position;
  var coords = this.game.game.iso.project(position);
  coords.y -= 70;
  // console.log(coords)
  this.game.game.debug.text(this.health_points, coords.x, coords.y)
  coords.y -= 20;
  this.game.game.debug.text(this.name, coords.x, coords.y)
}

Player.prototype.startMoving = function (velocity) {
  this.sprite.body.velocity.x = velocity.x;
  this.sprite.body.velocity.y = velocity.y;

  this.direction = velocity.normalize();
  this.sprite.animations.play(Utils.directionFromVector(this.direction));
}

Player.prototype.stopMoving = function () {
  this.sprite.body.velocity.x = 0;
  this.sprite.body.velocity.y = 0;
  this.sprite.animations.stop();
  var word_direction = Utils.directionFromVector(this.direction);
  this.sprite.animations.frame = Utils.standing_frames[word_direction];
}

Player.prototype.hasSnowball = function () {
  return this.equipped_snowball_count > 0;
}

Player.prototype.addSnowball = function () {
  this.equipped_snowball_count += 1;
}

Player.prototype.throwSnowball = function (force_multiplier) {
  console.log('throw')

  var snowball = this.game.add.isoSprite(
    this.sprite.body.position.x,
    this.sprite.body.position.y,
    50,
    'snowball',
    0,
    this.game.groups.snowballs
  );

  snowball.player = this; // setup back-reference

  snowball.anchor.set(0.5);
  this.game.physics.isoArcade.enable(snowball);
  // snowball.body.collideWorldBounds = true;
  snowball.body.gravity.z = -700;
  snowball.body.velocity.x = this.direction.x * 700 * force_multiplier;
  snowball.body.velocity.y = this.direction.y * 700 * force_multiplier;
  snowball.body.velocity.z = 400;

  this.equipped_snowball_count -= 1;
}

Player.prototype.handleSnowballHit = function () {
  this.health_points -= Math.floor(Math.random() * 25) + 30;

  if (this.health_points <= 0) {
    this.health_points = 0;
    this.states.start('disabled');
  }
}

module.exports = Player;
