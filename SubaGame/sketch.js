let diver, game, coin, enemySwimAnimation;
const startX = 400, startY = 300;
const canvasWidth = 800, canvasHeight = 600;
let port;
let frameC = 480; let frameE = 120;
let baseSpeed = 1.5;
let speed = baseSpeed;
let connectButton;
let frameStart, frameRecharge, prevLatest = 1;
let coinCollected = false;
let score = 0;
let fast = "4n";
let sequence1, sound, soundFX;
let melody = [
  "C4", "E4", "G4", "B4", ["A4", "G4", "F4", "E4"], // First phrase
  "D4", "F4", "A4", "C5", ["B4", "A4"], "G4", "F4", // Second phrase
  "E4", "G4", "B4", "D5", "C5", ["B4", "A4", "E4"]  // Third phrase
];

sound = new Tone.Synth({
  oscillator: {
    type: "square"
  },
  envelope: {
    attack: 0.1, 
    decay: 0.5, 
    sustain: 0.3, 
    release: 1
  }
}).toDestination();

sound.volume.value = -10;

const lowpass = new Tone.Filter({
  frequency: 500, 
  type: "lowpass",
  Q: 10 
}).toDestination();

sound.connect(lowpass);

const gameOverSound = new Tone.Synth({
  oscillator: {
    type: "sawtooth"
  },
  envelope: {
    attack: 0.1,
    decay: 0.5,
    sustain: 0,
    release: 1 
  }
}).toDestination();

const gameOverMelody = [
  ["D2", "F6", "A4", "C3"], "B5", "A6", ["G5", "F4"], 
  "E5", "G6", "B5", "D4", "C4", ["B6", "A5", "G4"], 
  "A3", ["C2", "E2", "G2", "F2"]  
];


sequence1 = new Tone.Sequence(function (time, note) {
  if (game.currentState === Game.States.GameOver) {
    gameOverSound.triggerAttackRelease(note, 0.5);
  } else {
    sound.triggerAttackRelease(note, 0.5);
  }
}, melody, fast);

const gameOverSequence = new Tone.Sequence(function (time, note) {
  gameOverSound.triggerAttackRelease(note, 0.5);
}, gameOverMelody, fast);

Tone.Transport.start();
Tone.Transport.bpm.value = 100;
Tone.Transport.timeSignature = [3,4];


function preload() {
  diver = new Scuba(startX, startY);
  enemySwimAnimation = loadAnimation('assets/Eel.png', {row: 0, col: 0, frames: 8, frameSize: [80,80]});
  coin = loadAnimation('assets/Coin.png', {row: 0, col: 0, frameSize: [50,50]});

  soundFX = new Tone.Players({
    coinCollect: "assets/coinCollect.mp3",
    electric: "assets/shock.mp3"
  }).toDestination();

  soundFX.volume.value = 6;
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  game = new Game(diver, Game.States.Start);
  connectButton = createButton("Connect");
  connectButton.mousePressed(connect);
  port = createSerial();
  let usedPorts = usedSerialPorts();
  if(usedPorts.length > 0) {
    port.open(usedPorts[0], 57600);
  }
  frameRate(60);
}


function draw() {
  background("#add8e6");
  game.update();

  frameCount++;
  let latest = port.readUntil("\n");
  if(latest != ""){
    button = Number(latest);
    if(button == 0){
      if(button == prevLatest && speed >= baseSpeed){
        speed = speed -0.05;
      } else if(button != prevLatest){
        speed = 4;
      } else {
        speed = baseSpeed;
      }
    } else {
      speed = baseSpeed;
    }
    prevLatest = button;
  }
  if (port.opened() && frameCount % 7 == 0) {
    let message;
    if(game.currentState === Game.States.Start){
      message = `255 0 0\n`;
    } else if (game.currentState === Game.States.Play){
      message = '0 255 0\n';
      if(coinCollected){
        message = '255 0 0\n';
        coinCollected = false;
      }
    } else {
      message = '0 0 255\n';
    }
    
    port.write(message);
  }
}

function connect() {
  if (!port.opened()){
    port.open('Arduino', 57600);
  } else {
    port.close();
  }
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

    this.sprite.debug = false;
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
    this.sprite.vel.y = -speed;
    this.sprite.rotation = 0;
  }

  swimDown(){
    this.sprite.changeAni('swim');
    this.sprite.vel.y = speed;
    this.sprite.rotation = 180;
  }

  swimRight() {
    this.sprite.changeAni('swim');
    this.sprite.vel.x = speed;
    this.sprite.rotation = 90;
  }

  swimLeft(){
    this.sprite.changeAni('swim');
    this.sprite.vel.x = -speed;
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
    this.coins = [];
    this.spawnCoin = true;
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
          const playerLeft = this.player.sprite.x;
          const playerRight = this.player.sprite.x + this.player.sprite.width;
          const playerTop = this.player.sprite.y + 5;
          const playerBottom = this.player.sprite.y + this.player.sprite.height;

          const enemyLeft = enemy.sprite.x + 5;
          const enemyRight = enemy.sprite.x + enemy.sprite.width - 20;
          const enemyTop = enemy.sprite.y + 10;
          const enemyBottom = enemy.sprite.y + enemy.sprite.height - 20;

          const isColliding = (
            (playerLeft >= enemyLeft && playerLeft <= enemyRight && playerTop >= enemyTop && playerTop <= enemyBottom) || // Top left corner
            (playerRight >= enemyLeft && playerRight <= enemyRight && playerTop >= enemyTop && playerTop <= enemyBottom) || // Top right corner
            (playerLeft >= enemyLeft && playerLeft <= enemyRight && playerBottom >= enemyTop && playerBottom <= enemyBottom) || // Bottom left corner
            (playerRight >= enemyLeft && playerRight <= enemyRight && playerBottom >= enemyTop && playerBottom <= enemyBottom) // Bottom right corner
          );

          if (isColliding && !enemy.collided) {
            enemy.sprite.collider = 'static';
            soundFX.player('electric').start();
            this.setState(Game.States.GameOver);
            enemy.collided = true; // Set the flag to true to indicate that the collision has been detected
          }
        }

        for(const coinC of this.coins){
          if(coinC.sprite.y >= 570){
            coinC.sprite.remove();
          }
        }

        for(const coinC of this.coins){
          const playerLeft = this.player.sprite.x;
          const playerRight = this.player.sprite.x + this.player.sprite.width;
          const playerTop = this.player.sprite.y;
          const playerBottom = this.player.sprite.y + this.player.sprite.height;

          const coinLeft = coinC.sprite.x;
          const coinRight = coinC.sprite.x + coinC.sprite.width;
          const coinTop = coinC.sprite.y;
          const coinBottom = coinC.sprite.y + coinC.sprite.height;

          const isColliding = (
            (playerLeft >= coinLeft && playerLeft <= coinRight && playerTop >= coinTop && playerTop <= coinBottom) || // Top left corner
            (playerRight >= coinLeft && playerRight <= coinRight && playerTop >= coinTop && playerTop <= coinBottom) || // Top right corner
            (playerLeft >= coinLeft && playerLeft <= coinRight && playerBottom >= coinTop && playerBottom <= coinBottom) || // Bottom left corner
            (playerRight >= coinLeft && playerRight <= coinRight && playerBottom >= coinTop && playerBottom <= coinBottom) // Bottom right corner
          );

          if (isColliding && !coinC.collided) {
            coinC.sprite.remove();
            coinCollected = true;
            soundFX.player('coinCollect').start();
            score++;
            coinC.collided = true; // Set the flag to true to indicate that the collision has been detected
          }
        }

        let msTime = Date.now() - this.startTime;
        this.totalTime = Math.floor(msTime / 1000);
        textSize(30);
        fill('white');
        text(`Time: ${this.totalTime}`, 20, 40);
        text(`Score: ${score}`, 600, 40);

        this.currentFrame++;
        
        if(this.spawnEnemies && this.currentFrame % frameE == 0) {
          let randomX = Math.random() < 0.5 ? -10 : 810; 
          let randomY = Math.random() * (550 - 30) + 30; 
          let newEnemy = new Enemy(randomX, randomY);
          this.enemies.push(newEnemy);
        }

        if(this.spawnCoin && this.currentFrame % frameC == 0) {
          let randomX = Math.random() * (600 - 20) + 20; 
          let newCoin = new Coin(randomX, -10);
          this.coins.push(newCoin);
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
    this.gameOverText.text = `Game Over\nTime: ${this.totalTime}\n Score: ${score}\nPress Space to Restart`;
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
    for(const coinC of this.coins) {
      coinC.sprite.remove();
    }
    soundFX.player('electric').stop();
    this.enemies = [];
    this.coins = [];
    this.currentFrame = 0;
    score = 0;
    this.player.setState(Scuba.States.Revive); 
    this.totalTime = 0;
    this.startTime = Date.now();
    Tone.start();
    sequence1.start();
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
          Tone.start();
          sequence1.start();
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
    this.sprite.addAni('swim', enemySwimAnimation);

    // this.useEelCollider();
    this.sprite.immovable = false;
    this.friction = 0;
    this.bounciness = 0;
    this.speed = 2;
    this.sprite.debug = false;
    this.sprite.collider = 'none';

    if (x === 810) {
      this.sprite.vel.x = -2;
    } else if (x === -10) {
      this.sprite.vel.x = 2; 
      this.sprite.mirror.x = true;
    }

    if(score >= 5){
      frameC = 300;
      frameE = 80;
      if(this.sprite.vel.x < 1){
        this.sprite.vel.x = -3.5
      } else {
        this.sprite.vel.x = 3.5;
      }
    } else if (score == 12){
      frameC = 200;
      frameE = 50;
      if(this.sprite.vel.x < 1){
        this.sprite.vel.x = -4.5
      } else {
        this.sprite.vel.x = 4.5;
      }
    } else if (score == 17){
      frameC = 200;
      frameE = 20;
      if(this.sprite.vel.x < 1){
        this.sprite.vel.x = -5.0;
      } else {
        this.sprite.vel.x = 5.0;
      }
    }
  }

  // useEelCollider() {
  //   this.sprite.removeColliders();
  //   this.sprite.addCollider(2, 0, 50, 20);
  //   this.sprite.bounciness = 0;
  //   this.sprite.immovable = false;
  // }
}

class Coin {
  constructor(x,y){
    this.sprite = new Sprite(x,y, 50, 50);
    this.sprite.addAni('coin', coin);
    this.sprite.vel.y = 2.5;
    this.sprite.debug = false;
    this.sprite.collider = 'none';
  }
}
