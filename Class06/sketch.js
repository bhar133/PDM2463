let sprite;

function preload() {
  sprite = new Sprite(200, 200, 80, 80);
  sprite.spriteSheet = 'assets/Cyclops.png';
  let animations = {
    stand: { row: 0, frames: 1},
    walkRight: { row: 0, col: 1, frames: 8},
    walkUp: { row: 5, frames: 6},
    walkDown: { row: 5, col: 6, frames: 6}
  };
  sprite.anis.frameDelay = 7;
  sprite.addAnis(animations);
  sprite.changeAni('walkRight');
}

function setup() {
  createCanvas(400, 400);

}

function draw() {
  background(30);

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

  if(sprite.x + sprite.width/4 > width){
    walkRight();
  } else if(sprite.x - sprite.width/4 < 0){
    walkLeft();
  } else if(sprite.y + sprite.height/4 > height){
    walkUp();
  } else if(sprite.y - sprite.height/4 < 0){
    walkDown();
  }
}

function stop(){
  sprite.vel.x = 0;
  sprite.vel.y = 0;
  sprite.changeAni('stand');
}

function walkRight() {
  sprite.changeAni('walkRight');
  sprite.vel.x = 1;
  sprite.vel.y = 0;
  sprite.scale.x = 1;
}


function walkLeft() {
  sprite.changeAni('walkRight');
  sprite.vel.x = -1;
  sprite.vel.y = 0;
  sprite.scale.x = -1;
}

function walkUp() {
  sprite.changeAni('walkUp');
  sprite.vel.y = -1;
  sprite.vel.x = 0;
}

function walkDown(){
  sprite.changeAni('walkDown');
  sprite.vel.y = 1;
  sprite.vel.x = 0;
}

function keyTypedOld() {
  switch(key){
    case 'd':
      walkRight();
      break;
    case 'a':
      walkLeft();
      break;
    case 'w':
      walkUp();
      break;
    case 's':
      walkDown();
      break;
  }
}