let face;
let face2;
let selectedColor;
let faces;

function setup() {
  createCanvas(400, 400);
  selectedColor = color('white');

  faces = [new Face(100, 100, color('yellow')), 
           new Face(250, 250, color('cyan')), 
           new Face(20, 290, color('green'))];
}

function draw() {
  background(220);
  
  for(let i = 0; i < faces.length; i++){
    faces[i].draw();
  }

  fill(selectedColor);
  circle(width - 30, 30, 40);
}

function mousePressed() {
  let isInFace = false;
  for(let i = 0; i < faces.length; i++) {
    if(faces[i].contains(mouseX, mouseY)){
      selectedColor = faces[i].fill;
      isInFace = true;
    }
  }
  
  if(!isInFace){
    selectedColor = color('white');
  }

  // if(face.contains(mouseX, mouseY)){
  //   selectedColor = face.fill;
  // } else if (face2.contains(mouseX, mouseY)){
  //   selectedColor = face2.fill;
  // } else{
  //   selectedColor = color('white');
  // }
  console.log('selected color is: ' + selectedColor);
}

class Face {
  constructor(x, y, fill){
    this.x = x;
    this.y = y;
    this.fill = fill;
  }

  draw() {
    fill(this.fill);
    square(this.x, this.y, 100);
    fill(0);
    circle(this.x+25, this.y+30, 20);
    circle(this.x+75, this.y+30, 20);
    stroke(0);
    line(this.x+20, this.y+50, this.x+80, this.y+50);
  }

  contains(x,y){
    let insideX = x >= this.x && x <= this.x + 100;
    let insideY = y >= this.y && y <= this.y + 100;
    return insideX && insideY;
  }
}
