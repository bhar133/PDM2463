let sequence1, square;
let melody = ["C3", ["E3", "G3", "D3", "C3"], "A3", "B2", "C2", "E3", ["A2", "G2"], "C4"];

square = new Tone.Synth({
  oscillator: {
    type: "square"
  },
  envelope: {
    attack: 0.8,
    decay: 0.1,
    sustain: 1,
    release: 0.1
  }
}).toDestination();

sequence1 = new Tone.Sequence (function (time,note){
  square.triggerAttackRelease(note, 0.5);
}, melody, "4n");

Tone.Transport.start();
Tone.Transport.bpm.value = 100;
Tone.Transport.timeSignature = [3,4];

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  text('Hold mouse for sound', width/3, height/2)
}

function mousePressed(){
  Tone.start();
  sequence1.start();
}

function mouseReleased(){
  sequence1.stop();
}
