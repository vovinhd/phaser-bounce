'use strict';

var Wall = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'wall', frame);

  // initialize your prefab here
  this.game.physics.arcade.enableBody(this);
  this.body.immovable = true;

};

Wall.prototype = Object.create(Phaser.Sprite.prototype);
Wall.prototype.constructor = Wall;

Wall.prototype.update = function() {

  // write your prefab's specific update code here

};

module.exports = Wall;
