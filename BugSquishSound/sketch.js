let timeRemaining = 30;
let gameOver = false;
let score = 0;
let bugs = [];
let sprite;
let fast = "4n";
let speed = 0.5;
let sequence1, square, soundFX;
let melody = [["G4", "A4", "D6", "C4"], "E4", "E3", ["C5", "G5", "D4", "A4"], "C3", "G4", ["A4", "D5", "D4", "A3"], ["C4", "G3"], "A2"];

square = new Tone.Synth({
  oscillator: {
    type: "square"
  },
  envelope: {
    attack: 0.8,
    decay: 0.1,
    sustain: 1,
    release: 0.1
  }
}).toDestination();

square.volume.value = -3;

sequence1 = new Tone.Sequence (function (time,note){
  square.triggerAttackRelease(note, 0.5);
}, melody, fast);

Tone.Transport.start();
Tone.Transport.bpm.value = 100;
Tone.Transport.timeSignature = [3,4];

function preload() {
  soundFX = new Tone.Players({
    squish: "assets/explosion.mp3"
  }).toDestination();

  let animations = {
    crawl: {row: 0, frames: 7},
    squish: { row: 0, col: 8, frames: 1}
  };

  
  for (let i = 0; i < 30; i++) {
    let bugX = random(20, 380);
    let bugY = random(20, 380);
    bugs.push(new Character(bugX, bugY, 32, 32, 'assets/bug.png', animations));
  }
}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  if(gameOver){
    over();
  }else{
    playing();
    for (let i = 0; i < bugs.length; i++) {
      bugs[i].crawl();
    }
  }

  
}

function mousePressed(){
  Tone.start();
  sequence1.start();
}

class Character {
  constructor(x, y, width, height, spriteSheet, animations){
    this.sprite = new Sprite(x, y, width, height);
    this.sprite.spriteSheet = spriteSheet;
    this.sprite.collider = 'none';
    this.sprite.anis.frameDelay = 7;
    this.sprite.addAnis(animations);
    this.sprite.changeAni('crawl');

    this.speed = speed; 
    this.sprite.vel = p5.Vector.random2D(); 
    this.sprite.vel.setMag(this.speed);

  }

  crawl(){
    this.x += this.sprite.vel.x * speed;
    this.y += this.sprite.vel.y * speed;

    if(this.sprite.x + this.sprite.width/4 >= width){
      this.sprite.vel.x = this.sprite.vel.x * -1;
      this.sprite.scale.x = 1;
    } else if(this.sprite.x - this.sprite.width/4 <= 0){
      this.sprite.vel.x = this.sprite.vel.x * -1;
      this.sprite.scale.x = -1;
    } else if(this.sprite.y + this.sprite.height/4 >= height){
      this.sprite.vel.y = this.sprite.vel.y * -1;
      this.sprite.scale.x = -1;
    } else if(this.sprite.y - this.sprite.height/4 <= 0){
      this.sprite.vel.y = this.sprite.vel.y * -1;
      this.sprite.scale.x = 1;
    }

    this.rotate();
  }

  rotate() {
    let angle = atan2(this.sprite.vel.y, this.sprite.vel.x);
    this.sprite.rotation = angle + 90;
  }

  updateSpeed(newSpeed) {
    this.speed = newSpeed;
    this.sprite.vel.setMag(this.speed);
  }

  updateSpeed(newSpeed) {
    this.speed = newSpeed;
    this.sprite.vel.setMag(this.speed);
  }

}

function over(){
  textAlign(CENTER);
  sequence1.stop();
  text("Time's Up!", width/2, height/2 - 50);
  text("Score: " + score, width/2, height/2);
}

function playing(){
  textSize(20);
  text("Score: " + score, width - 380, 30);
  text("Time: " + ceil(timeRemaining), width-100, 30);

  timeRemaining -= deltaTime / 1000;
  if(timeRemaining < 0){
    gameOver = true;
  }
}

function mouseReleased() {
  if (!gameOver) {
    for (let i = 0; i < bugs.length; i++) {
      let bug = bugs[i];
      if (
        mouseX >= bug.sprite.x &&
        mouseX <= bug.sprite.x + bug.sprite.width &&
        mouseY >= bug.sprite.y &&
        mouseY <= bug.sprite.y + bug.sprite.height
      ) {
        bug.sprite.changeAni('squish'); 
        bug.sprite.vel.x = 0;
        bug.sprite.vel.y = 0;
        speed *= 1.15;
        score++;
        // Increase volume and playback rate of the squish sound
        soundFX.player('squish').volume.value = 10; // Increase volume
        soundFX.player('squish').playbackRate = 2; // Double the playback rate
        soundFX.player('squish').start();
        if(score >= 10){
          sequence1.playbackRate = 1.5;
        }
        for (let j = 0; j < bugs.length; j++) {
          if (j !== i) {
            bugs[j].updateSpeed(speed);
            bugs[j].sprite.anis.frameDelay = 5;
            if(speed > 3){
              bugs[j].sprite.anis.frameDelay = 3;
            }
          }
        }
        break;
      }
    }
  }
}