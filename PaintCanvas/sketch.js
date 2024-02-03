let boxes;
let selectedColor;

function setup() {
  createCanvas(600, 800);

  selectedColor = color('white');

  boxes = [new Box(5, 5, color("red")),
           new Box(5, 35, color("orange")),
           new Box(5, 65, color("yellow")),
           new Box(5, 95, color("lime")),
           new Box(5, 125, color("cyan")),
           new Box(5, 155, color("blue")),
           new Box(5, 185, color("magenta")),
           new Box(5, 215, color("#8B4513")),
           new Box(5, 245, color("white")),
           new Box(5, 275, color("black")),]
}

function draw() {
  for(let i = 0; i < boxes.length; i++){
    boxes[i].draw();
  }
  
  fill(selectedColor);
  stroke(0);
  circle(20, 330, 30);
}

function mouseDragged(){
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height - 60) {
    fill(selectedColor); 
    noStroke();
    for (let i = 0; i < 5; i++) {
      let x = lerp(pmouseX, mouseX, i / 5);
      let y = lerp(pmouseY, mouseY, i / 5);
      ellipse(x, y, 25, 25); 
    }
    return false;
  }
}

function mousePressed() {
  let isInBox = false;
  for(let i = 0; i < boxes.length; i++) {
    if(boxes[i].contains(mouseX, mouseY)){
      selectedColor = boxes[i].fill;
      isInBox = true;
    }
  } 
}

class Box {
  constructor(x, y, fill){
    this.x = x;
    this.y = y;
    this.fill = fill;
  }

  draw() {
    fill(this.fill);
    noStroke();
    square(this.x, this.y, 30);
  }

  contains(x,y){
    let insideX = x >= this.x && x <= this.x + 30;
    let insideY = y >= this.y && y <= this.y + 30;
    return insideX && insideY;
  }
}

