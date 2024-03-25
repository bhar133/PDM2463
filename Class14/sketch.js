let osc = new Tone.Synth(100, 'sine').toDestination();
let lfo = new Tone.LFO(10, 100, 1000).connect(osc.frequency).start();


function keyPressed() {
  osc.triggerAttack();
}

function keyReleased() {
  osc.triggerRelease();
}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  text('Press and key for LFO', 100, 100);
}
