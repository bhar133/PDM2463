function preload() {
  bell = loadImage("assets/bell.jpg");
}

const synth = new Tone.PolySynth(Tone.Synth);
const bend = new Tone.PitchShift();
let vibrato = new Tone.Vibrato(5, 0.1);

synth.connect(vibrato);
vibrato.connect(bend);
bend.toDestination();

let soundFX = {
  'ding': 'C4',
  'follow': 'C5'
}



function mousePressed(){
  let playSound = soundFX.ding;
  let playSound2 = soundFX.follow;
  synth.triggerAttack(playSound);
  synth.triggerAttack(playSound2);
}

function mouseReleased(){
  let playSound = soundFX.ding;
  let playSound2 = soundFX.follow;
  synth.triggerRelease(playSound, '0.01');
  synth.triggerRelease(playSound2, '0.01');
}

function setup() {
  createCanvas(400, 400);
  bend.pitch = 12;
  vibrato.depth.value = 0.1;
}

function draw() {
  if(mouseIsPressed === true){background(bell);
  }else if (mouseIsPressed === false){ background(240);
    text("press mouse", 150, height/3);
  }
}
