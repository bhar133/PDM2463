let timeRemaining = 30;
let gameOver = false;
let score = 0;
let bugs = [];
let sprite;
let speed = 0.5;

function preload() {
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