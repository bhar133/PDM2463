let sounds = new Tone.Players ({
  'frog' : 'assets/frog.mp3',
  'bee' : 'assets/bee.mp3',
  'kingfisher' : 'assets/kingfisher.mp3',
  'crows' : 'assets/crows.mp3'
});

let delAmt = new Tone.FeedbackDelay("8n", 0.5);
let vibrato = new Tone.Vibrato(5, 0.1);
let distAmt = new Tone.Distortion(0.5);

let button1, button2, button3, button4;
let delaySlider, fbSlider, distSlider, vibratoSlider;

sounds.connect(delAmt);
delAmt.connect(vibrato);
vibrato.connect(distAmt);
distAmt.toDestination();

function setup() {
  createCanvas(400, 400);

  button1 = createButton('Frog Croak');
  button1.position(85, 100);
  button1.mousePressed(() => sounds.player('frog').start());

  button2 = createButton('Bee Buzzing');
  button2.position(205, 100);
  button2.mousePressed(() => sounds.player('bee').start());

  button3 = createButton('Kingfisher Call');
  button3.position(85, 150);
  button3.mousePressed(() => sounds.player('kingfisher').start());
  
  button4 = createButton('Crows Cawing');
  button4.position(205, 150);
  button4.mousePressed(() => sounds.player('crows').start());

  delaySlider = createSlider(0, 1, 0, 0.05);
  delaySlider.position(60,250);
  delaySlider.mouseMoved(() => delAmt.delayTime.value = delaySlider.value());

  vibratoSlider = createSlider(0, 1, 0, 0.05);
  vibratoSlider.position(200, 320);
  vibratoSlider.mouseMoved(() => vibrato.depth.value = vibratoSlider.value());

  fbSlider = createSlider(0, 0.9, 0, 0.05);
  fbSlider.position(200, 250);
  fbSlider.mouseMoved(() => delAmt.feedback.value = fbSlider.value());

  distSlider = createSlider(0, 0.9, 0, 0.05);
  distSlider.position(60, 320);
  distSlider.mouseMoved(() => distAmt.distortion = distSlider.value());
}

function draw() {
  background(180, 200, 50);
  text('Change Delay', 90, 240);
  text('Change Feedback', 220, 240);
  text('Edit Vibrato', 100, 310);
  text('Change Dist', 230, 310);
}
