let player, game;
const startX = 100, startY = 100;
const canvasWidth = 640, canvasHeight = 480;

function preload() {
  player = new Player(startX, canvasHeight*.75-40);
}

function setup() {  
  createCanvas(canvasWidth, canvasHeight, 'fullscreen');  
  game = new Game(player, Game.States.Start);
  frameRate(90);
}

function draw() {
  background(0);
  game.update();
}

function keyPressed() {
  game.keyPressed();
}

function keyReleased() {
  game.keyReleased();
}

class Player { 

  // Player States for FSM
  static States = {
    Stand: 0,
    WalkRight: 1,
    WalkLeft: 2,
    Jump: 3,
    FloorCollision: 4,
    Dead: 5,
    Revive: 6
  }

  constructor(x, y) {
    this.sprite = new Sprite(x,y,80,80);    
    this.sprite.spriteSheet = 'assets/meatboy.png';
    this.sprite.anis.frameDelay = 8;
    this.sprite.addAnis({
      walkHorizontal: {row: 0, col: 1, frames: 8, frameSize: [80, 80]},
      jump: {row: 9, col: 0, frames: 8, frameDelay: 3, frameSize: [80, 80]},
      dead: {row: 8, col: 7, frames: 1, frameSize: [80, 80]},
      stand: { row: 0, frames: 1, frameSize: [80, 80]}
    });
    this.jumpFrames = 0;
    this.startX = x;
    this.startY = y;

    this.useStandColliders();
    this.sprite.friction = 0;
    this.sprite.rotationLock = true;
    this.sprite.bounciness = 0;
    this.currentState = this.previousState = Player.States.Stand;

    this.speed = 3;

    this.sprite.debug = false;
  }

  useStandColliders() {
    this.sprite.removeColliders();
    this.sprite.addCollider(2,-5,40);
    this.sprite.addCollider(2,20,25,20);
    this.sprite.friction = 0;
  }

  useJumpColliders() {
    this.sprite.removeColliders();
    this.sprite.addCollider(2,-5,40);
    this.sprite.addCollider(5,20 ,15,20);
  }
  
  // Reset the player sprite to initial position 
  revive(x, y){
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.vel.x = 0;
    this.sprite.vel.y = 0;
    this.alive();
    this.setState(Player.States.Stand);
  }

  setState(newState) {
    //console.log(`${this.currentState} ${newState}`);
    if (this.currentState != newState) {
      this.previousState = this.currentState;
      this.currentState = newState;
      switch(newState) {
        case Player.States.Stand:
          this.stand();
          break;
        case Player.States.WalkRight: 
          this.walkRight();
          break;
        case Player.States.WalkLeft:
          this.walkLeft();
          break;
        case Player.States.Jump:
          this.jump();
          this.useJumpColliders();
          break;
        case Player.States.FloorCollision:
          if (this.previousState == Player.States.Jump) {
            this.useStandColliders();
            this.floorCollision();
            this.jumpFrames = 0;
          }
          else
            this.setState(this.previousState);
          break;
        case Player.States.Dead: 
          this.dead();
          break;
        case Player.States.Revive:
          this.revive(this.startX, this.startY);
          break;
      }
    }
  }

  update() {
    switch(this.currentState) {
      case Player.States.Jump:
        this.jumpFrames++;
        if (kb.pressing('left')) {
          this.sprite.vel.x = -this.speed;
          this.sprite.mirror.x = true;
        } else if (kb.pressing ('right')) {
          this.sprite.vel.x = this.speed ;
          this.sprite.mirror.x = false;
        } else {
          this.sprite.vel.x = 0;
        }
        break;
    }
  }

  keyPressed() {
    switch(this.currentState) {
      case Player.States.Stand:
      case Player.States.WalkRight:
      case Player.States.WalkLeft: 
        if (keyCode === RIGHT_ARROW)
          this.setState(Player.States.WalkRight);
        else if (keyCode === LEFT_ARROW) 
          this.setState(Player.States.WalkLeft);
        else if (keyCode === 32) 
          this.setState(Player.States.Jump);
        break;
      case Player.States.Jump:
        break;
    }
  }

  keyReleased() {
    switch(this.currentState) {
      case Player.States.Stand:
        break;
      case Player.States.WalkRight: 
        if (keyCode === RIGHT_ARROW) {
          if (keyIsDown(LEFT_ARROW))
            this.setState(Player.States.WalkLeft);
          else
            this.setState(Player.States.Stand);
        }
        break;
      case Player.States.WalkLeft:
        if (keyCode === LEFT_ARROW) {
          if (keyIsDown(RIGHT_ARROW))
            this.setState(Player.States.WalkRight);
          else
            this.setState(Player.States.Stand);
        }
          
        break;
      case Player.States.Jump:
        break;
    }
  }
  
  stand() {
    this.sprite.changeAni('stand');
    this.sprite.speed = 0;
  }
  
  walkRight() {
    this.sprite.changeAni('walkHorizontal');
    this.sprite.mirror.x = false;
    this.sprite.direction = 0;
    this.sprite.speed = this.speed;
    this.sprite.y++;
  } 
  
  walkLeft() {
    this.sprite.changeAni('walkHorizontal');
    this.sprite.mirror.x = true;
    this.sprite.direction = 180;
    this.sprite.speed = this.speed;
    this.sprite.y++;
  }
  
  jump() {
    this.sprite.changeAni('jump');
    this.sprite.ani.noLoop();
    this.sprite.ani.play(0);
    this.sprite.vel.y = -5;
  }

  floorCollision() {
    if (keyIsDown(LEFT_ARROW))
      this.setState(Player.States.WalkLeft);
    else if (keyIsDown(RIGHT_ARROW)) 
      this.setState(Player.States.WalkRight);
    else 
      this.setState(Player.States.Stand); 
  }

  dead() {
    this.sprite.collider = 'static';
    this.sprite.changeAni('dead');
    //this.sprite.visible = false;
  }

  alive() {
    //this.sprite.visible = true;
    this.sprite.collider = 'dynamic';
    this.stand();
  }
}



class Game {

  // Game states for FSM
  static States = {
    Start: 0,
    Play: 1,
    GameOver: 2
  }

  constructor(player, state = Game.States.Start) {
    this.floor = new Sprite();
    this.floor.y = height * 0.75 ;
    this.floor.w = width;
    this.floor.h = 5;
    this.floor.collider = 'static';
  
    world.gravity.y = 9.8;

    this.player = player;

    this.currentFrame = 0;
    this.startTime = Date.now();
    this.totalTime = 0;
    this.enemies = [];
    this.spawnEnemies = true;

    this.setState(state);
  }

  setState(newState) {
    if (this.currentState != newState) {
      switch(newState) {
        case Game.States.Play:
          this.reset();
          break;
        case Game.States.GameOver: 
          this.player.setState(Player.States.Dead);
          this.gameOver();
          break;
        case Game.States.Start:
          this.start();
          break;
      }
      this.currentState = newState;
    }
  }

  update() {
    switch (this.currentState) {
      case Game.States.Play:
        // Camera follows player
        camera.x = this.player.sprite.x;
        this.player.update();

        // Handle sprite collisions with floor only after multiple jumping frames
        if (this.player.jumpFrames > 2 && this.player.sprite.collides(this.floor))
        {
          this.player.setState(Player.States.FloorCollision); 
        } 

        // Check for collisions with enemies
        for(const enemy of this.enemies) {
          if (this.player.sprite.collides(enemy.sprite)) {
            enemy.sprite.collider = 'static';
            this.setState(Game.States.GameOver);
          }
        }

        // Sprite dropped below canvas, thus game over.
        if (this.player.sprite.y - this.player.sprite.height / 2 > height) {
          this.setState(Game.States.GameOver);
        }

        let msTime = Date.now() - this.startTime;
        this.totalTime = Math.floor(msTime / 1000);
        textSize(30);
        fill('white');
        text(`Time: ${this.totalTime}`, 20, 40);

        this.currentFrame++;
        // Every 120 frames (2 seconds at 60 fps), spawn new enemy
        if (this.spawnEnemies && this.currentFrame % 120 == 0) {
          let newEnemy = new Enemy(this.player.sprite.x + random(100)-50 , 0, random(20)+10, random(20)+10, 'dynamic');
          newEnemy.sprite.bounciness = random(1);
          this.enemies.push(newEnemy);
        }
        break;
      case Game.States.GameOver:
        break;
    }
  }

  gameOver() {
    this.gameOverBackground = new Sprite(camera.x, camera.y, width, height, 's');
    this.gameOverBackground.opacity = 0.75;
    this.gameOverBackground.color = "#faaba5";
    this.gameOverBackground.strokeWeight = 0;
    this.gameOverText = new Sprite(camera.x, camera.y, 0, 0, 's');
    this.gameOverText.d = 0;
    this.gameOverText.textSize = 32;
    this.gameOverText.text = `Game Over\nTime: ${this.totalTime}, Obstacles: ${this.enemies.length}\nPress Space to Restart`;
  }

  start() {
    this.gameStartBackground = new Sprite(camera.x, camera.y, width, height, 's');
    this.gameStartBackground.opacity = 0.75;
    this.gameStartBackground.color = "#fff";
    this.gameStartBackground.strokeWeight = 0;
    this.gameStartText = new Sprite(camera.x, camera.y, 0, 0, 's');
    this.gameStartText.d = 0;
    this.gameStartText.textSize = 32;
    this.gameStartText.text = "Press Space to Start";
  }

  reset() {
    if (this.gameOverText) {
      this.gameOverText.remove(); 
      this.gameOverBackground.remove();
    }

    if (this.gameStartText) {
      this.gameStartText.remove(); 
      this.gameStartBackground.remove();
    }

    for(const enemy of this.enemies) {
      enemy.sprite.remove();
    }
    this.enemies = [];
    this.currentFrame = 0;
    this.player.setState(Player.States.Revive); 
    this.totalTime = 0;
    this.startTime = Date.now();
  }

  keyPressed() {
    switch (this.currentState) {
      case Game.States.Play:
        this.player.keyPressed();
        break;
      case Game.States.GameOver:
      case Game.States.Start:
        if (keyCode === 32) {
          this.setState(Game.States.Play);
        }
        break;
    }
  }

  keyReleased() {
    switch (this.currentState) {
      case Game.States.Play:
        this.player.keyReleased();
        break;
      
    }
  }
}

class Enemy {
  constructor(x, y, w, h) {
    this.sprite = new Sprite(x, y, w, h);
  }
}