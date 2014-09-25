
  'use strict';

  var Cursor = require('../prefabs/cursor');
  var Wall = require('../prefabs/wall');

  function Play() {}
  Play.prototype = {
    create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.background = this.game.add.sprite(0, 0, 'bg');

      this.topC = new Cursor(this.game, 100, 570, 'topCursor', 1200);
      this.game.add.existing(this.topC);

      this.botC = new Cursor(this.game, 100, 150, 'botCursor', -1200);
      this.game.add.existing(this.botC);

      this.walls = this.game.add.group();

      this.topKey = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
      this.botKey = this.game.input.keyboard.addKey(Phaser.Keyboard.J);
      this.startKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

      this.topKey.onDown.add(this.topC.jump, this.topC);
      this.botKey.onDown.add(this.botC.jump, this.botC);
      this.startKey.onDown.addOnce(this.startGame, this);

      this.generateInitialWalls();


    },
    update: function() {
      this.walls.forEach(function(wall) {
        this.game.physics.arcade.collide(this.topC, wall, this.topCollisionHandler, null, this);
        this.game.physics.arcade.collide(this.botC, wall, this.botCollisionHandler, null, this);
      }, this);
    },
    generateInitialWalls: function() {
      console.log("inital walls");
      for(var i = 0; i < 1280; i += 64 ) {

        this.walls.add(new Wall(this.game, i, 0));
        this.walls.add(new Wall(this.game, i, 656));

        console.log("inital wall at " + i);

      }

    },
    generateWalls: function() {
      console.log("more walls");
    },
    deathHandler: function() {

    },
    shutdown: function() {

    },
    startGame: function() {
      this.topC.alive = true;
      this.botC.alive = true;
      this.topC.body.allowGravity = true;
      this.botC.body.allowGravity = true;
      this.wallGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.25, this.generateWalls, this);
      this.walls.setAll('body.velocity.x', -200);


    },
    collisionHandler: function(cursor) {
      console.log("collision")
      cursor.collides = true
    },
    topCollisionHandler: function() {
      this.collisionHandler(this.topC);
    },
    botCollisionHandler: function() {
      this.collisionHandler(this.botC);
    }

  };

  module.exports = Play;
