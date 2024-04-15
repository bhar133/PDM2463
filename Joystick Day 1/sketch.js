let port;
let joyX = 0, joyY = 0, sw = 0;
let connectButton;
let circleX, circleY;
let speed = 3;

function setup() {
  port = createSerial();
  createCanvas(400, 400);

  circleX = width/2;
  circleY = height/2;

  connectButton = createButton("Connect");
  connectButton.mousePressed(connect);
}

function draw() {
  background(220);

  let str = port.readUntil("\n");
  let values =  str.split(",");
  if(values.length > 2){
    joyX = values[0];
    joyY = values[1];
    sw = Number(values[2]);

    if(joyX > 0){
      circleX += speed;
    } else if(joyX < 0){
      circleX -= speed;
    }
    if(joyY > 0){
      circleY += speed;
    } else if(joyY < 0){
      circleY -= speed;
    }
  }

  if(sw == 1){
    fill("blue");
  } else{
    fill("red");
  }
  circle(circleX, circleY, 50);
}

function connect() {
  if (!port.opened()){
    port.open('Arduino', 9600);
  } else {
    port.close();
  }
}
