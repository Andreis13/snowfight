
var Preload = function () {};

Preload.prototype.preload = function () {
  this.load.spritesheet('knight_8frame', 'assets/img/sprites/knight/8frame_combined.png', 70, 70);

  this.load.image('tile',     'assets/img/sprites/tile.png');
  this.load.image('snowball', 'assets/img/sprites/snowball_small.png');
};

Preload.prototype.create = function () {
  // Add and enable the plug-in.
  this.game.plugins.add(new Phaser.Plugin.Isometric(this.game));

  // Start the IsoArcade physics system.
  this.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
  this.physics.isoArcade.gravity.setTo(0, 0, -500);
  this.game.iso.anchor.setTo(0.5, 0.5);

  this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL

  this.state.start('play');
}

module.exports = Preload;
