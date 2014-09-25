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
},{"./states/boot":4,"./states/gameover":5,"./states/menu":6,"./states/play":7,"./states/preload":8}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){

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

},{}],5:[function(require,module,exports){

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

},{}],6:[function(require,module,exports){

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

},{}],7:[function(require,module,exports){

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

},{"../prefabs/cursor":2,"../prefabs/wall":3}],8:[function(require,module,exports){

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