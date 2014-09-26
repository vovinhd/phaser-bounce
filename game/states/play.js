
  'use strict';

  var Cursor = require('../prefabs/cursor');
  var Wall = require('../prefabs/wall');
  var Scoreboard = require('../prefabs/scoreboard');

  function Play() {}
  Play.prototype = {
    create: function() {
      this.t0;
      this.score = 0;
      this.speed = -200;
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.background = this.game.add.sprite(0, 0, 'bg');

      this.topC = new Cursor(this.game, this.game.width / 2, 570, 'topCursor', 1200);
      this.game.add.existing(this.topC);

      this.botC = new Cursor(this.game, this.game.width / 2, 150, 'botCursor', -1200);
      this.game.add.existing(this.botC);

      this.walls = this.game.add.group();

      this.topKey = this.game.input.keyboard.addKey(Phaser.Keyboard.J);
      this.botKey = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
      this.startKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

      this.topKey.onDown.add(this.topC.jump, this.topC);
      this.botKey.onDown.add(this.botC.jump, this.botC);
      this.startKey.onDown.addOnce(this.startGame, this);

      this.scoreText = this.game.add.bitmapText(this.game.width/2, 10, 'flappyfont',this.score.toString(), 24);
      this.scoreText.visible = false;

      this.generateInitialWalls();


    },
    update: function() {
      this.topC.collides = false;
      this.botC.collides = false;
      this.walls.forEach(function(wall) {
        this.game.physics.arcade.collide(this.topC, wall, this.topCollisionHandler, null, this);
        this.game.physics.arcade.collide(this.botC, wall, this.botCollisionHandler, null, this);
        this.game.physics.arcade.collide(this.topC, this.game.world,  this.deathhandler, null, this);
      }, this);

      //lose condition
      // x < 0, y > 720, y < 0
      if(this.topC.alive) {
        if( this.topC.position.x < 0 || 720 < this.topC.position.y || this.topC.position.y < 0
           || this.botC.position.x < 0 || 720 < this.botC.position.y || this.botC.position.y < 0) {
          this.deathHandler();
        }
        this.score = this.game.time.elapsedSince(this.t0);
        this.scoreText.setText(this.score.toString());
      }


    },
    generateInitialWalls: function() {
      for(var i = 0; i < 1280; i += 64 ) {
        this.walls.add(new Wall(this.game, i, 0));
        this.walls.add(new Wall(this.game, i, 656));
      }
    },
    generateWalls: function() {

      console.log("more walls");
      this.speed =  -200 - this.score / 100;
      var factor = Math.abs(this.speed / 200);
      for(var i = 0; i < 20; i += 1 ) {
        var topY = this.game.rnd.integerInRange(0, 100);
        var botY = this.game.rnd.integerInRange(0, 100);

        this.walls.add(new Wall(this.game, i * 64  * factor + 1280, 0 + topY));
        this.walls.add(new Wall(this.game, i * 64 * factor + 1280, 656 - botY));

        console.log("wall at " + i);
      }
      this.walls.setAll('body.velocity.x', this.speed);
      this.topC.speed =  -this.speed;
      this.botC.speed =  -this.speed;

    },
    deathHandler: function() {
      console.log("game over");
      this.topC.alive = false;
      this.botC.alive = false;
      this.wallGenerator.timer.stop();
      this.walls.forEach(function(wall) {
        this.game.add.tween(wall.body.velocity).to({x: 0}, 2000, Phaser.Easing.Linear.None, true);
      }, this);
      this.scoreboard = new Scoreboard(this.game);
      this.game.add.existing(this.scoreboard);
      this.scoreboard.show(this.score);
      this.startKey.onDown.addOnce(this.reset, this);

    },

    shutdown: function() {
      this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
      this.game.input.keyboard.removeKey(Phaser.Keyboard.F);
      this.game.input.keyboard.removeKey(Phaser.Keyboard.J);
      this.scoreboard.destroy();
      this.walls.destroy();
      this.topC.destroy();
      this.botC.destroy();

    },
    startGame: function() {
      this.speed = -200;
      this.topC.alive = true;
      this.botC.alive = true;
      this.topC.body.allowGravity = true;
      this.botC.body.allowGravity = true;
      this.wallGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1280/-this.speed, this.generateWalls, this);
      this.wallGenerator.timer.start();
      this.generateWalls();
      this.walls.setAll('body.velocity.x', this.speed);
      this.t0 = this.game.time.now;
      this.scoreText.visible = true;
    },
    collisionHandler: function(cursor) {
      cursor.collides = true;
    },
    topCollisionHandler: function() {
      this.topC.collides  = true;
    },
    botCollisionHandler: function() {
      this.collisionHandler(this.botC);
    },
    reset: function() {
      this.game.state.start('play');
    },
    showScoreboard: function() {

    }
  };

  module.exports = Play;
