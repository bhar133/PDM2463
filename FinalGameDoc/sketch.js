let characterImg;
let itemImg;
let creatureImg;
let setUp;

function preload() {
  characterImg = loadImage('assets/Scuba.png');
  itemImg = loadImage('assets/Coin.png');
  creatureImg = loadImage('assets/Eel.png');
  setUp = loadImage('assets/ArduinoWiring.png');
}

function setup() {
  createCanvas(1000, 1100);
  textSize(16);
  textAlign(LEFT);
}

function draw() {
  background(220);
  // Display project proposal description on screen
  text("CSC 2463 Final Project\nName: Benjamin Harrington\nProject Title: Scuba Survival\n\nDescription:\n\n“Scuba Survival” will be an underwater survival game. You will have to grab \ncertain items while surviving the creatures of the deep. The goal of the game is to gather as many items as possible. You will lose though if you take too many attacks from the creatures of the deep. The game will start off easier and increase in difficulty when you collect more items. This is because the items attract the creatures of the deep. To pick up items you will just have to make the character sprite touch the item sprite.", 20, 20, 900, 700);
  text("To Start the game you hit the spacebar. You will know the game is ready to start when your ardunio led turns green. Once the game has begun the LED will glow blue. You use the arrow keys to move around, then you can also hit the button on your arduino set to give your diver a small speed boost. When you collect a coin the light will blink green, your score will also increase. If you hit an enemy the game over screen will show you how long you survived and how high your score was. It will also allow you to restart the game!", 20, 260, 900, 700);
  
  text("Diver Sprite Sheet:", 20, 395);
  image(characterImg, 20, 400, 300, 100);
  
  text("Coin:", 350, 395);
  image(itemImg, 350, 400, 90, 90);
  
  text("Creature", 500, 395);
  image(creatureImg, 500, 400, 400, 100);

  text("Arduino Set Up - Wiring, Button, LED:", 20, 530);
  image(setUp, 20, 535, 600, 500);

  text("To see a video of the whole game and Arduino working copy this link: https://www.youtube.com/shorts/q3imqs2ex0o", 20, 1090);
}
