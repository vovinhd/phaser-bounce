(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'bounce');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":5,"./states/gameover":6,"./states/menu":7,"./states/play":8,"./states/preload":9}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],6:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],7:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'yeoman');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.titleText = this.game.add.text(this.game.world.centerX, 300, '\'Allo, \'Allo!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to play "Click The Yeoman Logo"', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText.anchor.setTo(0.5, 0.5);

    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],8:[function(require,module,exports){

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

},{"../prefabs/cursor":2,"../prefabs/scoreboard":3,"../prefabs/wall":4}],9:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('yeoman', 'assets/yeoman-logo.png');
    this.load.image('bg', 'assets/bg.png');
    this.load.image('botCursor', 'assets/botCursor.png');
    this.load.image('topCursor', 'assets/topCursor.png');
    this.load.image('wall', 'assets/wall.png');
    this.load.image('startButton', 'assets/start-button.png');
    this.load.bitmapFont('flappyfont', 'assets/fonts/flappyfont/flappyfont.png', 'assets/fonts/flappyfont/flappyfont.fnt');

  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('play');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])