const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 600

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
}

function draw() {
  background(100)
  line(0, 0, mouseX, mouseY)
}
