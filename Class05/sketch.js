let toy;
let rotation = 0;
let score = 0;
let speed = 3;
let timeRemaining = 15;
let gameOver = false;
let success, fail, normal;
let lastAttempt;

function preload(){
  toy = loadImage("assets/toy.png")
}

function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);
  angleMode(DEGREES);
  success = color('green');
  fail = color('red');
  normal = color('white');
  lastAttempt = normal;
}

function draw() {
  background(lastAttempt);

  if(gameOver){
    over();
  }else{
    playing();
  }
}

function playing(){
  push();
    translate(width/2, height/2);
    rotate(rotation+=speed);
    image(toy, 80, 0);
  pop();

  if(rotation >= 360){
    rotation = 0;
  }

  textSize(20);
  text("Score: " + score, 10, 30);
  text("Time: " + ceil(timeRemaining), width-100, 30);

  timeRemaining -= deltaTime / 1000;
  if(timeRemaining < 0){
    lastAttempt = normal;
    gameOver = true;
  }
}

function over(){
  textAlign(CENTER);
  text("Time's Up!", width/2, height/2 - 50);
  text("Score: " + score, width/2, height/2);
  text("PRESS SPACEBAR TO PLAY AGAIN", width/2, height/2 + 50);
}

function keyTyped() {   
  if( key === ' '){
    if(gameOver){
      timeRemaining = 15;
      score = 0;
      gameOver = false;
    }else{
      if(rotation >= 340 || rotation <= 20){ 
        score++;
        lastAttempt = success;
      } else{
        score--;
        lastAttempt = fail;
      }
    }
  }
}

