'use strict';
var facings = [0, 90, 180, 270];

var Cursor = function(game, x, y, spriteRef, gravity) {
  Phaser.Sprite.call(this, game, x, y, spriteRef, gravity, 0);
  this.initialX = x;
  this.hasJumped = true;
  this.game.physics.arcade.enableBody(this);
  this.anchor.setTo(0.5, 0.5);
  this.alive = false;
  this.collides = false;
  this.body.allowGravity = false;
  this.body.gravity.y = gravity;
  this.body.customSeperateX = true;
  this.speed = 200;
};

Cursor.prototype = Object.create(Phaser.Sprite.prototype);
Cursor.prototype.constructor = Cursor;

Cursor.prototype.update = function() {
  if(this.alive && !this.collides) {
    this.hasJumped = true;
    this.angle += 2.5;
  }
  if(this.alive && this.collides) {
    this.hasJumped = false;
    console.log(this.hasJumped.toString() + " jumpstate");

    this.angle = 0;
    this.body.velocity.x = this.speed;
  } else {
    this.body.velocity.x = 0;
  }
  if(this.alive && this.position.x < this.initialX) {
    this.body.velocity.x +=30;
  } else if (this.position.x > this.initialX) {
    this.body.velocity.x -=10;
  }
  if(!this.alive && this.collides) {
    this.body.velocity.x -= 50;
  }

};

Cursor.prototype.jump = function() {
  console.log(this.hasJumped.toString() + " jumpstate");
  if(this.alive && !this.hasJumped) {
    if (this.body.gravity.y > 0) {
      this.body.velocity.y = -600;
    } else {
      this.body.velocity.y = 600;
    }
  }
};

module.exports = Cursor;
