
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'hammerjs'], factory);
  } else if (typeof exports === 'object') {
    factory(require('jquery'), require('hammerjs'));
  } else {
    factory(jQuery, Hammer);
  }
}(function ($, Hammer) {

  var reqAnimationFrame = (function () {
    return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
  })();

  var Trackball = function (element, callbackFunctions) {
    this.callbacks = $.extend({
      onstart: function () { console.log('start') },
      onmove:  function () { console.log('move')  },
      onend:   function () { console.log('end')   }
    }, callbackFunctions);

    this.container = $(element);
    this.ball = this.container.find('.trackball');
    this.ballElement = this.ball[0];

    this.ticking = false;
    this.ballPosition = { x: 0, y: 0 };
    this.clampRadius;
    this.squaredClampRadius;
    this.clampRadiusContainerRatio = 0.50;

    this.setupElements();

    this.hammer = new Hammer(this.ball[0]);
    this.hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    var that = this;

    $(window).resize(function () {
      that.setupElements();
    });

    this.hammer.on('panstart', function (ev) {
      that.ball.css({transition: 'all 0.0s'});
      that.clampAndMove(ev);
      that.callbacks.onstart(that.normalizeCoords(that.ballPosition));
    });

    this.hammer.on('panmove', function (ev) {
      that.clampAndMove(ev);
      that.callbacks.onmove(that.normalizeCoords(that.ballPosition));
    });

    this.hammer.on('panend', function (ev) {
      that.clampAndMove(ev);
      that.callbacks.onend(that.normalizeCoords(that.ballPosition));
      that.resetBall();
    });
  }

  Trackball.prototype.requestRedraw = function (vec) {
    if (!this.ticking) {
      var that = this;
      reqAnimationFrame(function () {
        that.redrawBallPosition();
      });
      this.ticking = true;
    }
  }

  Trackball.prototype.setupElements = function () {
    this.container.height("100%");
    this.container.width("100%");

    var size = Math.min(this.container.outerWidth(), this.container.outerHeight());
    var ballSize = size * 0.25;
    var ballOffset = (size - ballSize) / 2;

    this.clampRadius = size / 2 * this.clampRadiusContainerRatio;
    this.squaredClampRadius = this.clampRadius * this.clampRadius;

    this.container.outerWidth(size);
    this.container.outerHeight(size);

    this.ball.width(ballSize);
    this.ball.height(ballSize);

    this.ball.css({
      left: Math.round(ballOffset),
      top: Math.round(ballOffset)
    });
  }

  Trackball.prototype.redrawBallPosition = function () {
    var value = 'translate(' + this.ballPosition.x + 'px,' + this.ballPosition.y + 'px)';
    var element = this.ballElement
    element.style.webkitTransform = value;
    element.style.mozTransform = value;
    element.style.transform = value;
    this.ticking = false;
  }

  Trackball.prototype.resetBall = function () {
    this.ball.css({ transition: 'all 0.3s' });
    this.ballPosition = { x: 0, y: 0 };
    this.requestRedraw();
  }

  Trackball.prototype.normalizeCoords = function (vec) {
    return {
      x: Math.round(vec.x * 100.0 / this.clampRadius),
      y: Math.round(vec.y * 100.0 / this.clampRadius)
    };
  }

  Trackball.prototype.squareLength = function (vec) {
    return vec.x * vec.x + vec.y * vec.y;
  }

  Trackball.prototype.clampCoords = function (vec) {
    var sqLength = this.squareLength(vec);
    if (sqLength <= this.squaredClampRadius) {
      return vec;
    }

    var k = Math.sqrt(this.squaredClampRadius / sqLength);

    return { x: Math.round(vec.x * k), y: Math.round(vec.y * k) };
  }

  Trackball.prototype.clampAndMove = function (ev) {
    this.ballPosition = this.clampCoords({ x: ev.deltaX, y: ev.deltaY });
    this.requestRedraw();
  }

  function Plugin(options) {
    return this.each(function () {
      var $this   = $(this);
      var data    = $this.data('trackball');

      if (!data) {
        $this.data('trackball', new Trackball(this, options));
      }
    })
  }

  $.fn.trackball = Plugin;
}));
