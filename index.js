const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 600

let ln

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
  ln = new Line(4)
}

function draw() {
  background(100)
  ln.draw([createVector(width / 2, height / 2), createVector(mouseX, mouseY)])
}

function Line(strokeWidth) {
  this.strokeWidth = strokeWidth

  this.draw = points => {
    if (points.length < 2) {
      return
    }

    strokeWeight(this.strokeWidth)
    for (let i = 0; i < points.length - 1; i++) {
      const from = points[i]
      const to = points[i + 1]
      line(from.x, from.y, to.x, to.y)
    }
  }
}
