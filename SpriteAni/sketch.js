let viking;
let meatMan;
let jungleMan;

function preload() {
  viking = new Sprite(200, 200, 80, 80);
  viking.spriteSheet = 'assets/Viking.png';
  meatMan = new Sprite(100, 200, 80, 80);
  meatMan.spriteSheet = 'assets/MeatMan.png';
  jungleMan = new Sprite(300, 200, 80, 80);
  jungleMan.spriteSheet = 'assets/JungleMan.png';
  let animations = {
    stand: { row: 0, frames: 1},
    walkRight: { row: 0, col: 1, frames: 8},
    walkUp: { row: 5, frames: 6},
    walkDown: { row: 5, col: 6, frames: 6}
  };
  viking.anis.frameDelay = 7;
  viking.addAnis(animations);
  viking.changeAni('walkRight');
  meatMan.anis.frameDelay = 7;
  meatMan.addAnis(animations);
  meatMan.changeAni('walkRight');
  jungleMan.anis.frameDelay = 7;
  jungleMan.addAnis(animations);
  jungleMan.changeAni('walkRight');
}

function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(100);

  if(kb.pressing('d')){
    walkRight();
  } else if (kb.pressing('a')){
    walkLeft();
  } else if (kb.pressing('w')){
    walkUp();
  } else if(kb.pressing('s')){
    walkDown();
  } else {
    stop();
  }

  if(viking.x + viking.width/4 > width || meatMan.x + meatMan.width/4 > width || jungleMan.x + jungleMan.width/4 > width){
    walkLeft();
  } else if(viking.x - viking.width/4 < 0 || meatMan.x - meatMan.width/4 < 0 || jungleMan.x - jungleMan.width/4 < 0){
    walkRight();
  } else if(viking.y + viking.height/4 > height || meatMan.y + meatMan.height/4 > height || jungleMan.y + jungleMan.height/4 > height){
    walkUp();
  } else if(viking.y - viking.height/4 < 0 || meatMan.y - meatMan.height/4 < 0 || jungleMan.y - jungleMan.height/4 < 0){
    walkDown();
  }
}

function stop(){
  viking.vel.x = 0;
  viking.vel.y = 0;
  viking.changeAni('stand');
  meatMan.vel.x = 0;
  meatMan.vel.y = 0;
  meatMan.changeAni('stand');
  jungleMan.vel.x = 0;
  jungleMan.vel.y = 0;
  jungleMan.changeAni('stand');
}

function walkRight() {
  viking.changeAni('walkRight');
  viking.vel.x = 1;
  viking.vel.y = 0;
  viking.scale.x = 1;
  meatMan.changeAni('walkRight');
  meatMan.vel.x = 1;
  meatMan.vel.y = 0;
  meatMan.scale.x = 1;
  jungleMan.changeAni('walkRight');
  jungleMan.vel.x = 1;
  jungleMan.vel.y = 0;
  jungleMan.scale.x = 1;
}


function walkLeft() {
  viking.changeAni('walkRight');
  viking.vel.x = -1;
  viking.vel.y = 0;
  viking.scale.x = -1;
  meatMan.changeAni('walkRight');
  meatMan.vel.x = -1;
  meatMan.vel.y = 0;
  meatMan.scale.x = -1;
  jungleMan.changeAni('walkRight');
  jungleMan.vel.x = -1;
  jungleMan.vel.y = 0;
  jungleMan.scale.x = -1;
}

function walkUp() {
  viking.changeAni('walkUp');
  viking.vel.y = -1;
  viking.vel.x = 0;
  meatMan.changeAni('walkUp');
  meatMan.vel.y = -1;
  meatMan.vel.x = 0;
  jungleMan.changeAni('walkUp');
  jungleMan.vel.y = -1;
  jungleMan.vel.x = 0;
}

function walkDown(){
  viking.changeAni('walkDown');
  viking.vel.y = 1;
  viking.vel.x = 0;
  meatMan.changeAni('walkDown');
  meatMan.vel.y = 1;
  meatMan.vel.x = 0;
  jungleMan.changeAni('walkDown');
  jungleMan.vel.y = 1;
  jungleMan.vel.x = 0;
}