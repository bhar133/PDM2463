let diver, game;
const startX = 400, startY = 300;
const canvasWidth = 800, canvasHeight = 600;

function preload() {
  diver = new Scuba(startX, startY);
}

function setup() {
  createCanvas(canvasWidth, canvasHeight, 'fullscreen');
  game = new Game(diver, Game.States.Start);
  frameRate(60);
}


function draw() {
  background("#add8e6");
  game.update();
}

function keyPressed(){
  game.keyPressed();
}

function keyReleased() {
  game.keyReleased();
}

class Scuba {
  
  static States = {
    SwimUp: 0,
    Dead: 1,
    SwimDown: 2,
    SwimLeft: 3,
    SwimRight: 4,
    Float: 5,
    Revive: 6
  }

  constructor(x,y) {
    this.sprite = new Sprite(x,y,80,80);
    this.sprite.spriteSheet = 'assets/Scuba.png';
    this.sprite.addAnis({
      swim: {row: 0, col: 0, frames: 13, frameSize: [80, 80]},
      dead: {row: 1, col: 0, frameSize: [80, 80]},
      float: {row: 0, col: 4, frames: 3, frameSize: [80, 80]}
    });
    this.jumpFrames = 0;
    this.startX = x;
    this.startY = y;

    this.useColliders();
    this.sprite.friction = 0;
    this.sprite.bounciness = 0;
    this.currentState = this.previousState = Scuba.States.Float;

    this.speed = 3;

    this.sprite.debug = true;
  }

  useColliders() {
    this.sprite.removeColliders();
    this.sprite.addCollider(2, 0, 40, 55);
    this.sprite.friction = 0;
  }

  revive(x,y) {
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.vel.x = 0;
    this.sprite.vel.y = 0;
    this.alive();
    this.setState(Scuba.States.Float);
  }

  setState(newState) {
    if(this.current != newState){
      this.previousState = this.currentState;
      this.currentState = newState;
      switch(newState){
        case Scuba.States.Float:
          this.float();
          break;
        case Scuba.States.SwimUp:
          this.swimUp();
          break;
        case Scuba.States.Dead:
          this.dead();
          break;
        case Scuba.States.SwimDown:
          this.swimDown();
          break;
        case Scuba.States.SwimLeft:
          this.swimLeft();
          break;
        case Scuba.States.SwimRight:
          this.swimRight();
          break;
        case Scuba.States.Revive:
          this.revive(this.startX, this.startY);
          break;
      }
    }
  }

  keyPressed() {
    switch(this.currentState) {
      case Scuba.States.SwimUp:
      case Scuba.States.SwimDown:
      case Scuba.States.SwimLeft:
      case Scuba.States.SwimRight:
      case Scuba.States.Float:
        if(keyCode === RIGHT_ARROW){
          this.setState(Scuba.States.SwimRight);
        } else if (keyCode === LEFT_ARROW){
          this.setState(Scuba.States.SwimLeft);
        } else if(keyCode === UP_ARROW){
          this.setState(Scuba.States.SwimUp);
        } else if(keyCode === DOWN_ARROW){
          this.setState(Scuba.States.SwimDown)
        }
    }
  }

  keyReleased() {
    switch(this.currentState) {
      case Scuba.States.Float:
        break;
      case Scuba.States.SwimLeft:
        if(keyCode === LEFT_ARROW) {
          if(keyIsDown(RIGHT_ARROW))
            this.setState(Scuba.States.SwimRight);
          else if(keyIsDown(UP_ARROW))
            this.setState(Scuba.States.SwimUp)
          else if(keyIsDown(UP_ARROW))
            this.setState(Scuba.States.SwimUp)
          else
            this.setState(Scuba.States.Float);
        }
        break;
      case Scuba.States.SwimRight:
        if(keyCode === RIGHT_ARROW) {
          if(keyIsDown(LEFT_ARROW))
            this.setState(Scuba.States.SwimLeft);
          else if(keyIsDown(UP_ARROW))
            this.setState(Scuba.States.SwimUp)
          else if(keyIsDown(UP_ARROW))
            this.setState(Scuba.States.SwimUp)
          else
            this.setState(Scuba.States.Float);
        }
        break;
      case Scuba.States.SwimUp:
        if(keyCode === UP_ARROW) {
          if(keyIsDown(DOWN_ARROW))
            this.setState(Scuba.States.SwimDown);
          else if(keyIsDown(RIGHT_ARROW))
            this.setState(Scuba.States.SwimRight)
          else if(keyIsDown(LEFT_ARROW))
            this.setState(Scuba.States.SwimLeft)
          else
            this.setState(Scuba.States.Float);
        }
        break;
      case Scuba.States.SwimDown:
        if(keyCode === DOWN_ARROW) {
          if(keyIsDown(UP_ARROW))
            this.setState(Scuba.States.SwimUp);
          else if(keyIsDown(RIGHT_ARROW))
            this.setState(Scuba.States.SwimRight)
          else if(keyIsDown(LEFT_ARROW))
            this.setState(Scuba.States.SwimLeft)
          else
            this.setState(Scuba.States.Float);
        }
        break;
      case Scuba.States.Dead:
        break;
    }
  }

  float(){
    this.sprite.changeAni('float');
    this.sprite.speed = 0;
    this.sprite.vel.y = 0;
    this.sprite.rotation = 0;
  }

  swimUp(){
    this.sprite.changeAni('swim');
    this.sprite.vel.y = -1.5;
    this.sprite.rotation = 0;
  }

  swimDown(){
    this.sprite.changeAni('swim');
    this.sprite.vel.y = 1.5;
    this.sprite.rotation = 180;
  }

  swimRight() {
    this.sprite.changeAni('swim');
    this.sprite.vel.x = 1.5;
    this.sprite.rotation = 90;
  }

  swimLeft(){
    this.sprite.changeAni('swim');
    this.sprite.vel.x = -1.5;
    this.sprite.rotation = -90;
  }

  dead() {
    this.sprite.collider = 'static';
    this.sprite.changeAni('dead');
  }

  alive() {
    this.sprite.collider = 'dynamic';
    this.float();
  }

}

class Game {
  static States = {
    Start: 0,
    Play: 1,
    GameOver: 2
  }

  constructor(player, state = Game.States.Start) {
    this.floor = new Sprite();
    this.floor.y = height;
    this.floor.w = width;
    this.floor.h = 30;
    this.floor.collider = 'static';
    this.floor.color = 'yellow';

    world.gravity.y = 0;

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
          this.player.setState(Scuba.States.Dead);
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
    switch(this.currentState){
      case Game.States.Play:

        for(const enemy of this.enemies){
          if(this.player.sprite.collides(enemy.sprite)){
            enemy.sprite.collider = 'static';
            this.setState(Game.States.GameOver);
          }
        }

        let msTime = Date.now() - this.startTime;
        this.totalTime = Math.floor(msTime / 1000);
        textSize(30);
        fill('white');
        text(`Time: ${this.totalTime}`, 20, 40);

        this.currentFrame++;
        
        if(this.spawnEnemies && this.currentFrame % 120 == 0) {
          let randomX = Math.random() < 0.5 ? -10 : 810; 
          let randomY = Math.random() * (550 - 30) + 30; 
          let newEnemy = new Enemy(randomX, randomY);
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
    this.gameOverBackground.color = "faaba5";
    this.gameOverBackground.strokeWeight = 0;
    this.gameOverText = new Sprite(camera.x, camera.y, 0, 0, 's');
    this.gameOverText.d = 0;
    this.gameOverText.textSize = 32;
    this.gameOverText.text = `Game Over\nTime: ${this.totalTime}\nPress Space to Restart`;
  }

  start() {
    this.gameStartBackground = new Sprite(camera.x, camera.y, width, height, 's');
    this.gameStartBackground.opacity = 0.75;
    this.gameStartBackground.color = "#add8e6";
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
    this.player.setState(Scuba.States.Revive); 
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
  constructor(x, y){
    this.sprite = new Sprite(x,y,80,80);
    this.sprite.spriteSheet = 'assets/Eel.png';
    this.sprite.addAnis({
      swim: {row: 0, col: 0, frames: 8, frameSize: [80,80]}
    });
    
    this.useEelCollider();
    this.friction = 0;
    this.bounciness = 0;
    this.speed = 2;
    this.sprite.debug = true;

    if (x === 810) {
      this.sprite.vel.x = -2;
    } else if (x === -10) {
      this.sprite.vel.x = 2; 
      this.sprite.mirror.x = true;
    }
  }

  useEelCollider() {
    this.sprite.removeColliders();
    this.sprite.addCollider(2, 0, 50, 20);
    this.sprite.bounciness = 0;
    this.sprite.immovable = false;
  }
}
