let currentState = 0

let tri
let sightLine
let rooms = [0]
let animatedLines = []

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
  rectMode(CENTER)
  textSize(TEXT_SIZE)
  textAlign(CENTER, CENTER)

  tri = new Triangle(ROOM_X, ROOM_Y, 20, 20)
}

function draw() {
  tri.update()

  background(BACKGROUND_COLOR)

  strokeWeight(2)

  sightLine = new Line(ROOM_X, ROOM_Y + ROOM_H * 0.5, mouseX, mouseY)

  const reflectionLines = getReflectionLines(sightLine, getMirrors())

  drawRooms()
  tri.draw()

  strokeWeight(4)
  stroke(0, 0, 0, 255)

  if (isSightLineVisible()) {
    drawingContext.setLineDash([10])
    sightLine.draw()

    drawingContext.setLineDash([])
    reflectionLines.forEach(ln => ln.draw())
  }

  drawEye()

  text(states[currentState].prompt, PROMPT_X, PROMPT_Y)

  if (states[currentState].startButtonVisible) {
    drawStartButton()
  }

  stroke(4)
  animatedLines.forEach(ln => ln.draw())
}

function mousePressed() {
  tri.click()
  buttonClicked()
  clickClickRect()
}

function mouseReleased() {
  tri.unClick()
}
