
$ = require('jquery');
var Player = require('../player.js');
var LocalController = require('../controllers/local.js');
var RemoteController = require('../controllers/remote.js');

var Play = function (connections) {
  this.connections = connections;
};

Play.prototype.create = function () {

  this.createGroups();
  this.createFloor();
  this.createPlayers();

}

Play.prototype.createGroups = function () {
  this.groups = {
    root: this.add.group()
  };

  this.groups.floor_tiles = this.add.group(this.groups.root, 'floor_tiles');
  this.groups.players = this.add.group(this.groups.root, 'players');
  this.groups.snowballs = this.add.group(this.groups.root, 'snowballs');
}

Play.prototype.createFloor = function () {
  var tile;

  var putTile = function(x, y) {
    tile = this.add.isoSprite(x, y, 0, 'tile', 0, this.groups.floor_tiles);
    tile.anchor.set(0.5, 0.5);

    this.physics.isoArcade.enable(tile);
    tile.body.allowGravity = false;
    tile.body.immovable = true;
  }.bind(this)

  var horizontal_tile_count = 13;
  var vertical_tile_count = 15;
  var tile_offset = 38;

  var h_half = Math.floor(horizontal_tile_count / 2);
  var v_half = Math.floor(vertical_tile_count / 2);

  for (i = -v_half; i < v_half; i++) {
    for (j = -h_half; j <= h_half; j++) {
      putTile((j-i) * (-tile_offset), (j+i) * tile_offset);
    }

    for (j = -h_half; j < h_half; j++) {
      putTile((j-i) * (-tile_offset), (j+i+1) * tile_offset);
    }
  }

  for (j = -h_half; j <= h_half; j++) {
    putTile((j-v_half) * (-tile_offset), (j+v_half) * tile_offset);
  }
}

Play.prototype.createPlayers = function () {
  this.players = []

  for (var i = 0; i < this.connections.length; i++) {
    this.players.push(new Player(
      this,
      this.makePlayerSprite(i * 40, i * -40),
      new RemoteController(this.connections[i])
    ));
  }

  this.players.push(new Player(
    this,
    this.makePlayerSprite(-80, 80),
    new LocalController(this.game.input)
  ));

  this.snowballs = []

  // this.players = [
  //   new Player(this, this.makePlayerSprite(0, 0), new LocalController(this.game.input)),
  //   new Player(this, this.makePlayerSprite(100, 100), new Controller())
  // ]
}

Play.prototype.update = function () {
  $.each(this.players, function (idx, player) { player.update(); });

  this.physics.isoArcade.collide(this.groups.floor_tiles, this.groups.players);
  this.physics.isoArcade.collide(this.groups.players, undefined, function (player1, player2) {
    console.log('hop')
  });

  this.physics.isoArcade.collide(
    this.groups.players, this.groups.snowballs,
    function (player_sprite, snowball) {
      player_sprite.player.handleSnowballHit();
      snowball.destroy();
    },
    function (player_sprite, snowball) {
      if (snowball.player == player_sprite.player) {
        return false;
      } else {
        return true;
      }
    }
  );

  this.snowballs = this.snowballs.filter(function(snowball) {
    if (snowball.body.position.z < 0) {
      snowball.destroy();
      return false;
    } else {
      return true;
    }
  })

  this.game.iso.topologicalSort(this.groups.players);
};

Play.prototype.render = function () {
  // this.game.debug.body(this.players[0].sprite);
  // this.game.debug.body(this.groups.floor_tiles.getAt(9));
  // this.game.debug.bodyInfo(this.players[0].sprite, 32, 32);
  $.each(this.players, function (idx, player) { player.render(); });
}

Play.prototype.makePlayerSprite = function (x, y) {
  var sprite = this.game.add.isoSprite(x, y, 100, 'knight_8frame', 0, this.groups.players);
  sprite.anchor.set(0.5);

  sprite.tint = Math.random() * 0xffffff;
  this.physics.isoArcade.enable(sprite);

  sprite.body.setSize(18, 18, 60, 0, 0, -18);

  // sprite.body.collideWorldBounds = true;

  sprite.animations.add('south_east', [0,  1,  2,  3,  4,  5,  6,  7],  20, true);
  sprite.animations.add('south_west', [8,  9,  10, 11, 12, 13, 14, 15], 20, true);
  sprite.animations.add('north_east', [16, 17, 18, 19, 20, 21, 22, 23], 20, true);
  sprite.animations.add('north_west', [24, 25, 26, 27, 28, 29, 30, 31], 20, true);

  sprite.animations.add('south', [32, 33, 34, 35, 36, 37, 38, 39], 20, true);
  sprite.animations.add('west',  [40, 41, 42, 43, 44, 45, 46, 47], 20, true);
  sprite.animations.add('east',  [48, 49, 50, 51, 52, 53, 54, 55], 20, true);
  sprite.animations.add('north', [56, 57, 58, 59, 60, 61, 62, 63], 20, true);

  return sprite;
}


module.exports = Play;
