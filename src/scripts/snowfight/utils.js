
var Utils = {
  directions: ['west', 'north_west', 'north', 'north_east', 'east', 'south_east', 'south', 'south_west'],
  directionFromVector: function (v) {
    var up = new Phaser.Point(0, 0);
    var degrees = up.angle(v, true); // can be between -180 and 180

    // 202.5 --> 180 + 22.5
    // 22.5 is the offset that sets the direction in the middle of the sector
    // 0.5001 is a hack to get all value
    var idx = Math.floor((degrees + 202.5) / 45);
    if (idx > 7) { idx = 0 } // loopback index
    return Utils.directions[idx];
  },
  standing_frames: {
    west: 40,
    north_west: 24,
    north: 56,
    north_east: 16,
    east: 48,
    south_east: 0,
    south: 32,
    south_west: 8
  }
};

module.exports = Utils;
