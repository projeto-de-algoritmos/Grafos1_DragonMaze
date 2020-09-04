function setup() {
  createCanvas(screen.width * 0.9, screen.height * 0.8);
}

function draw () {
  if (mouseIsPressed) {
    fill(0);
  } else {
    fill(255);
  }
  ellipse(mouseX, mouseY, 80, 80);
}