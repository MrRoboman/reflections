const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 600

let mirror
let ln

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
  mirror = new Line({
    points: [
      createVector(width * 0.25, 10),
      createVector(width * 0.25, height - 10),
    ],
    weight: 2,
  })
  ln = new Line({ weight: 4 })
}

function draw() {
  background(100)

  ln.points = [
    createVector(width / 2, height / 2),
    createVector(mouseX, mouseY),
  ]

  ln.draw()
  mirror.draw()
}

function Line({ points, weight }) {
  this.points = points || []
  this.weight = weight

  this.draw = () => {
    if (this.points.length < 2) {
      return
    }

    strokeWeight(this.weight)
    for (let i = 0; i < this.points.length - 1; i++) {
      const from = this.points[i]
      const to = this.points[i + 1]
      line(from.x, from.y, to.x, to.y)
    }
  }
}
