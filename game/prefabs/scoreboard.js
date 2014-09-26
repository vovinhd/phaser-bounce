'use strict';

var Scoreboard = function(game) {

  Phaser.Group.call(this, game);

  this.gameOverText = this.game.add.bitmapText(this.game.width/2, 100, 'flappyfont', 'Game Over', 24);
  this.add(this.gameOverText);

  this.scoreText = this.game.add.bitmapText(this.game.width/2, 180, 'flappyfont', '', 18);
  this.add(this.scoreText);

  this.bestScoreText = this.game.add.bitmapText(this.game.width/2, 230, 'flappyfont', '', 18);
  this.add(this.bestScoreText);

  this.startButton = this.game.add.button(this.game.width/2, 300, 'startButton', this.startClick, this);

  this.add(this.startButton);

  this.y = this.game.height;
  this.x = 0;

};

Scoreboard.prototype = Object.create(Phaser.Group.prototype);
Scoreboard.prototype.constructor = Scoreboard;

Scoreboard.prototype.update = function() {

  // write your prefab's specific update code here

};

Scoreboard.prototype.show = function(score) {
  var bestScore;
  this.scoreText.setText('Score: ' + score.toString());

  if(!!localStorage) {

    bestScore = localStorage.getItem('bestScore');

    if(!bestScore || bestScore < score) {
      bestScore = score;
      localStorage.setItem('bestScore', bestScore);
    }
  } else {
    bestScore ='N/A';
  }

  this.bestScoreText.setText('Top Score: ' + bestScore.toString());

  this.game.add.tween(this).to({y: 0}, 1000, Phaser.Easing.NONE, true);
};

Scoreboard.prototype.startClick = function() {
  this.game.state.start('play');
};

module.exports = Scoreboard;
