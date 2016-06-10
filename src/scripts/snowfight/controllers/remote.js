

var Controller = require('./base.js');

var RemoteController = function (connection) {
  this.connection = connection;

  Controller.call(this);

  connection.on('data', function (data) {
    switch (data.type) {
      case 'trackball':
        this.trackball.x = data.x;
        this.trackball.y = data.y;
        break;
      case 'button_pressed':
        this['button_' + data.name + '_down'] = true;
        break;
      case 'button_released':
        this['button_' + data.name + '_down'] = false;
        break;
      default:
        break;
    }
  }.bind(this))
}

RemoteController.prototype = new Controller();
RemoteController.prototype.constructor = RemoteController;


RemoteController.prototype.feedback = function () {
  console.log('remote feedback');
  this.connection.send({'type':'feedback'});
}


module.exports = RemoteController;
