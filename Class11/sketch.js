let synth = new Tone.PolySynth(Tone.Synth);
let bend = new Tone.PitchShift();
let filter = new Tone.Filter(200, "lowpass"); // Define a lowpass filter with a cutoff frequency of 200 Hz
let isFilterOn = false; // Variable to track if the filter is on or off

bend.pitch = 0;
synth.connect(bend);
bend.connect(filter);
filter.toDestination();

let notes = {
  'a' : 'C4',
  's' : 'D4',
  'd' : 'E4',
  'f' : 'F4',
  'g' : 'G4',
  'h' : 'A4',
  'j' : 'B4',
  'k' : 'C5',
  'w' : 'C#4',
  'e' : 'D#4',
  'r' : 'F#4',
  't' : 'G#4',
  'y' : 'A#4',
  'l' : 'C5'
}

let filterButton;

function setup() {
  createCanvas(400, 400);

  pitchSlider = createSlider(0, 12, 0, 0.1);
  pitchSlider.position(120, 200);
  pitchSlider.mouseMoved(() => bend.pitch = pitchSlider.value());

  filterButton = createButton('Toggle Filter');
  filterButton.position(140, 300);
  filterButton.mousePressed(toggleFilter);
}

function keyPressed(){
  let playNotes = notes[key];
  synth.triggerAttack(playNotes);
}

function keyReleased(){
  let playNotes = notes[key];
  synth.triggerRelease(playNotes, '+0.1');
}

function draw() {
  background(100, 220, 150);
  textSize(20);
  textStyle(BOLD);
  text('play A-K and W-Y for synth', 80, 150);
}

function toggleFilter() {
  if (isFilterOn) {
    // Turn off the filter
    filter.frequency.rampTo(200, 0.1); // Set the filter back to its original frequency
    isFilterOn = false;
  } else {
    // Turn on the filter
    filter.frequency.rampTo(800, 0.1); // Set the filter cutoff frequency to 800 Hz
    isFilterOn = true;
  }
}
