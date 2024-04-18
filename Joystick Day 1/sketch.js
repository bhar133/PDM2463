let port;
let joyX = 0, joyY = 0, sw = 0;
let connectButton;
let circleX, circleY;
let speed = 3;
let mousePressedFlag = false;
let spacebarPressed = false;

function setup() {
  port = createSerial();
  createCanvas(400, 400);

  circleX = width/2;
  circleY = height/2;

  connectButton = createButton("Connect");
  connectButton.mousePressed(connect);

  let usedPorts = usedSerialPorts();
  if(usedPorts.length > 0) {
    port.open(usedPorts[0], 57600);
  }
  frameRate(60);
}

function draw() {
  background(220);

  frameCount++;
  // let characters = port.available();
  // let str = port.read(character);
  // let lines = str.split("\n");
  // let latest = "";
  // if(lines.length > 0){
  //   let lastIndex = lines.lenght > 1 ? lines.length-2 : lines.length-1;
  //   latest = lines[lastIndex];
  // }
  let latest = port.readUntil("\n");
  let values =  latest.split(",");
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

  noStroke();
  fill("red");
  rect(0,0, width/4, height/2);
  fill("orange");
  rect(width/4, 0, width/4, height/2);
  fill("yellow");
  rect(width/2, 0, width/4, height/2);
  fill("green");
  rect(width-width/4, 0, width/4, height/2);
  fill("blue");
  rect(0,height/2, width/4, height/2);
  fill("purple");
  rect(width/4, height/2, width/4, height/2);
  fill("white");
  rect(width/2, height/2, width/4, height/2);
  fill("brown");
  rect(width-width/4, height/2, width/4, height/2);

  if (port.opened() && frameCount % 3 == 0) {
    let pixel = get(circleX, circleY);
    let message;
    if(mousePressedFlag){
      message = `0 0 0\n`;
    } else if(spacebarPressed){
      let colorR = pixel[0] + 20;
      let colorG = pixel[1] + 20;
      let colorB = pixel[2] + 20;
      message = `${colorR} ${colorG} ${colorB}\n`
    } else {
      message = `${pixel[0]} ${pixel[1]} ${pixel[2]}\n`;
    }
    
    port.write(message);
  }

  if(sw == 1){
    fill("blue");
  } else{
    fill("red");
  }
  circle(circleX, circleY, 10);
}

function connect() {
  if (!port.opened()){
    port.open('Arduino', 57600);
  } else {
    port.close();
  }
}

function mousePressed(){
  if(mousePressedFlag){
    mousePressedFlag = false;
  } else{
    mousePressedFlag = true;
  }
}

function keyPressed() {
  if (keyCode === 32) { // Check if spacebar is pressed
    if(spacebarPressed){
      spacebarPressed = false;
    } else{
      spacebarPressed = true;
    }
  }
}