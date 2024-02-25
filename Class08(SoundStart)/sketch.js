let soundFX;

function preload (){
  soundFX = new Tone.Players({
    frog: "assets/frog.mp3",
    bee: "assets/bee.mp3"
  }).toDestination(); //Sends audio to go to audio output
}

function setup() {
  createCanvas(400, 400);

  button1 = createButton('Frog Croak');
  button1.position(85, 150);
  button1.mousePressed(() => soundFX.player('frog').start());

  button2 = createButton('Buzzing Bee');
  button2.position(205, 150);
  button2.mousePressed(() => soundFX.player('bee').start());
}


function draw() {
  background(220, 100, 200);
  // text('Press Q or W for sound!', 120, 150);
}

// function keyPressed(){
//   if(key == 'q'){
//     soundFX.player('frog').start();
//   } else if(key == 'w'){
//     soundFX.player('bee').start();
//   }
// }