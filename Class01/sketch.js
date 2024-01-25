function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(220);

  //Example 1
  noStroke();
  fill(0,255,0);
  rect(10, 10, 250, 120);
  fill(255,255,255);
  stroke(0);
  strokeWeight(1.5);
  circle(70, 70, 100);
  square(140, 20, 100);

  //Example 2
  noStroke();
  square(334, 12, 180)
  fill(255, 0, 0, 70);
  circle(425, 70, 100);
  fill(0, 255, 0, 70);
  circle(460, 130, 100);
  fill(0, 0, 255, 70);
  circle(390, 130, 100);

  //Example 3
  fill(0, 0, 0);
  rect(10, 280, 300, 150);
  fill(255, 255, 0);
  arc(90, 355, 110, 110, (5*PI)/4, (3*PI)/4);
  fill(255, 0, 0);
  circle(230, 355, 110);
  rect(175, 360, 110, 50);
  fill(255, 255, 255);
  circle(205, 350, 30);
  circle(255, 350, 30);
  fill(0, 0, 255);
  circle(205, 350, 20);
  circle(255, 350, 20);

  //Example 4
  fill(0, 0, 150);
  square(350, 350, 200);
  stroke(255);
  strokeWeight(3);
  fill(0, 120, 0);
  circle(450, 450, 100);
  fill(255, 0, 0);
  drawStar(450, 450, 20, 50, 5);
}

function drawStar(x, y, radius1, radius2, npoints){
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for(let a = -PI/2; a < TWO_PI-PI/2; a += angle){
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle)* radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}