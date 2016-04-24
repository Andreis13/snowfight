
$ = require('jquery');
var Peer = require('peerjs');
var Settings = require('./settings.json');
var Game = require('./snowfight/game.js');


$(function () {
  var hub_id = 'test';// getRandomId();

  console.log(Settings.peerjs_host)

  var hub = new Peer(hub_id, {
    host: Settings.peerjs_host,
    port: Settings.peerjs_port,
    secure: Settings.using_https,
    debug: Settings.peerjs_debug_level
  });


  hub.on('open', function(id) {
    $('#hub-id').html(id);
  });

  var connections = [];

  hub.on('connection', function(dataConnection) {
    console.log(dataConnection)
    $('#connections').append('<li>'+ dataConnection.metadata.player_name + ' : ' + dataConnection.label +'</li>');
    connections.push(dataConnection);
  });

  var game;
  // $('#connection-info').hide();
  // var width = $('body').width();
  // var height = $('body').height();
  // game = new Game(width, height, []);
  // game.start();

  $('#start').click(function () {
    $('#connection-info').hide();
    var width = $('body').width();
    var height = $('body').height();
    game = new Game(width, height, connections);
    game.start();
  });
});
