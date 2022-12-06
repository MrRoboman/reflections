const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 600

let ln

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
  ln = new Line()
}

function draw() {
  background(100)
  ln.draw()
}

function Line() {
  this.points = [createVector(10, 10), createVector(CANVAS_WIDTH - 10, 10)]

  this.draw = () => {
    for (let i = 0; i < this.points.length - 1; i++) {
      const from = this.points[i]
      const to = this.points[i + 1]
      line(from.x, from.y, to.x, to.y)
    }
  }
}
