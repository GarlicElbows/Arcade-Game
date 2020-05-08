// Establish game area
const maximumX = 400;
const maximumY = 380;
const water = 0;
const allowedChances = 3;
var audioWin = new Audio(
  "http://www.thanatosrealms.com/war2/sounds/humans/buildings/shipyard.wav"
);
var audioCrash = new Audio(
  "http://www.fright-bytes.com/spooky-sound-files/spooky-wavs/headchop.wav"
);
var audioEnd = new Audio("http://www.mario-museum.net/sons/smb_gameover.wav");

// Alert crash pop up
function alertCrash() {
  alert("Oh No! - you hit a bug, nevermind try again :)");
}

// Alert success pop up
function alertPoint() {
  alert("Well Done! - you got to the end, you're a real superstar!");
}

// Enemies our player must avoid
let Enemy = function (x, y) {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  this.x = x;
  this.y = y;
  this.speed = 175 + Math.floor(Math.random() * 400);

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = "images/enemy-bug.png";
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x = this.x + this.speed * dt;

  // Make sure the bugs come back onscreen
  if (this.x > 550) {
    this.x = -100;
    this.speed = 100 + Math.floor(Math.random() * 300);
  }

  // connect to html "points" text for updates throughout the game
  document.getElementById("points").innerHTML = player.points;

  // connect to html "chances" text for updates throughout the game
  document.getElementById("chances").innerHTML =
    allowedChances - player.crashCounter;

  // finding out if player has crashed into bug
  if (
    player.x < this.x + 60 &&
    player.x + 37 > this.x &&
    player.y < this.y + 25 &&
    30 + player.y > this.y
  ) {
    //play starts on a random first grid square after crashing, for a bit of variety
    player.x = Math.floor(Math.random() * 4) * 100;
    player.y = 380;
    player.crashCounter++;

    //Play a Sound
    audioCrash.play();

    // Let PLayer know they hit a bug
    alertCrash();

    // Player is only to have 3 chances then reset
    if (player.crashCounter === 3) {
      audioEnd.play();
      player.points = 0;
      alert("You have run out of chances, game over");

      // Counter is reset to zero
      player.crashCounter = 0;
    }
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
let Player = function () {
  this.x = 200;
  this.y = 380;
  this.speed = 50;
  this.points = 0;
  this.crashCounter = 0;
  this.sprite = "images/char-horn-girl.png";
};

Player.prototype.update = function () {
  // stops movement outside the canvas by player
  if (this.y > maximumY) {
    this.y = 380;
  }
  if (this.x > maximumX) {
    this.x = 400;
  }
  if (this.x < water) {
    this.x = 0;
  }

  // Verify if the player reaches the water
  if (this.y < water) {
    this.x = 200;
    this.y = 380;

    // Points are incremented
    this.points++;

    //Play a Sound
    audioWin.play();

    // Let Player know they got a point
    alertPoint();
  }
};

// Draw the player on the screen
Player.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Tracks the arrow key press for moving player around the canvas
Player.prototype.handleInput = function (keyPress) {
  switch (keyPress) {
    case "left":
      this.x -= this.speed + 50;
      break;
    case "up":
      this.y -= this.speed + 30;
      break;
    case "right":
      this.x += this.speed + 50;
      break;
    case "down":
      this.y += this.speed + 30;
      break;
  }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [];
let player = new Player();

// Establish enemies on the canvas
let enemies = [45, 130, 200];

// Enemy "engine" that generates them at varying speeds
enemies.forEach(function (position) {
  let enemy = new Enemy(0, position);
  allEnemies.push(enemy);
});

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener("keyup", function (e) {
  const allowedKeys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
