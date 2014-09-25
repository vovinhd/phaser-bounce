'use strict';

var Cursor = function(game, x, y, spriteRef, gravity) {
  Phaser.Sprite.call(this, game, x, y, spriteRef, gravity, 0);

  // initialize your prefab here
  this.game.physics.arcade.enableBody(this);
  this.anchor.setTo(0.5, 0.5);
  this.alive = false;
  this.collides = false;
  this.body.allowGravity = false;
  this.body.gravity.y = gravity;
  this.body.customSeperateX = true;
};

Cursor.prototype = Object.create(Phaser.Sprite.prototype);
Cursor.prototype.constructor = Cursor;

Cursor.prototype.update = function() {
  if(this.alive && !this.collides) {
    this.angle += 2.5;
  }
  if(this.collides) this.angle = 0;
};

Cursor.prototype.jump = function() {
  if(this.alive && this.collides) {
    this.collides = false;
    if (this.body.gravity.y > 0) {
      this.body.velocity.y = -600;
    } else {
      this.body.velocity.y = 600;
    }
  }
};

module.exports = Cursor;
