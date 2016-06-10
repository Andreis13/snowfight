

var Controller = function () {
  this.trackball = { x: 0, y: 0 };
  this.button_a_down = false;
  this.button_b_down = false;

  this.button_a_was_down = false;
  this.button_b_was_down = false;
}

Controller.prototype.button_a_pressed = function () {
  if (!this.button_a_was_down && this.button_a_down) {
    this.button_a_was_down = true;
    return true;
  } else {
    this.button_a_was_down = this.button_a_down;
    return false;
  }
}

Controller.prototype.button_b_pressed = function () {
  if (!this.button_b_was_down && this.button_b_down) {
    this.button_b_was_down = true;
    return true;
  } else {
    this.button_b_was_down = this.button_b_down;
    return false;
  }
}

Controller.prototype.button_a_released = function () {
  if (this.button_a_was_down && !this.button_a_down) {
    this.button_a_was_down = false;
    return true;
  } else {
    this.button_a_was_down = this.button_a_down;
    return false;
  }
}

Controller.prototype.button_b_released = function () {
  if (this.button_b_was_down && !this.button_b_down) {
    this.button_b_was_down = false;
    return true;
  } else {
    this.button_b_was_down = this.button_b_down;
    return false;
  }
}

Controller.prototype.feedback = function () {
  console.log('base feedback');
}

module.exports = Controller;
