$ = require('jquery');
var Peer = require('peerjs');
var Settings = require('./settings.json');

require('./controller/jquery.trackball.js');


function toggleFullScreen() {
  var doc = window.document;
  var docEl = doc.documentElement;


  var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
  var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

  if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    requestFullScreen.call(docEl);
  }
  else {
    cancelFullScreen.call(doc);
  }
}

function set_viewport_height() {
  $("html, body").css({
    height: $(window).height()
  });
}

function absorb_event(event) {
  var e = event || window.event;
  e.preventDefault && e.preventDefault();
  e.stopPropagation && e.stopPropagation();
  e.cancelBubble = true;
  e.returnValue = false;
  return false;
}

function setupController(player_name, hub_id) {
  $('.controller').removeClass('hidden')

  $(window).resize(function (event) {
    set_viewport_height()
  })

  $('#fullscreen-toggle').click(function() {
    toggleFullScreen()
  })


  var satellite = new Peer({
    host: Settings.peerjs_host,
    port: Settings.peerjs_port,
    secure: Settings.using_https,
    debug: Settings.peerjs_debug_level
  })

  hub_id = hub_id || 'test';

  var dataConnection = satellite.connect(hub_id, { metadata: { player_name: player_name } })

  $('#trackball-one').trackball({
    onstart: function (data) {
      data.type = 'trackball';
      dataConnection.send(data);
    },
    onmove: function (data) {
      data.type = 'trackball';
      dataConnection.send(data);
    },
    onend: function (data) {
      dataConnection.send({
        type: 'trackball',
        x: 0, y: 0
      });
    }
  });

  $('#btn-a').on('touchstart mousedown', function (event) {
    dataConnection.send({
      type: 'button_pressed',
      name: 'a'
    });
    $(this).addClass('pressed');
    absorb_event(event);
  });

  $('#btn-a').on('touchend mouseup', function (event) {
    dataConnection.send({
      type: 'button_released',
      name: 'a'
    });
    $(this).removeClass('pressed');
    absorb_event(event);
  });

  dataConnection.on('data', function (data) {
    if (data.type == 'feedback') {
      navigator.vibrate([500]);
    }
  });
}



$(function () {
  set_viewport_height()

  $('form').on('submit', function (event) {
    var name = $('#player-name').val();
    var hub_id = $('#hub-id').val();
    $('#input-form').hide()
    absorb_event(event);
    setupController(name, hub_id);
  })
});
