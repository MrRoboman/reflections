const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 600

let mirror

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
  mirror = new Line(width * 0.6, height * 0.25, width * 0.6, height * 0.75)
}

function draw() {
  background(100)

  const ln = new Line(width * 0.5, height * 0.5, mouseX, mouseY)

  const intersection = findIntersection(ln, mirror)

  ln.draw()
  mirror.draw()

  if (intersection) {
    fill(255, 0, 0)
    ellipse(intersection.x, intersection.y, 10, 10)
  }
}

function Line(startX, startY, endX, endY) {
  this.start = createVector(startX, startY)
  this.end = createVector(endX, endY)

  this.interpolate = t => {
    return p5.Vector.lerp(this.start, this.end, t)
  }

  this.draw = () => {
    line(this.start.x, this.start.y, this.end.x, this.end.y)
  }
}

// Adapted from
// https://github.com/hapticdata/toxiclibsjs/blob/3712b44242128245084f18cbad7f0dfa0fc41d9b/lib/toxi/geom/Line2D.js#L126
function findIntersection(lineA, lineB) {
  const denom =
    (lineB.end.y - lineB.start.y) * (lineA.end.x - lineA.start.x) -
    (lineB.end.x - lineB.start.x) * (lineA.end.y - lineA.start.y)
  const na =
    (lineB.end.x - lineB.start.x) * (lineA.start.y - lineB.start.y) -
    (lineB.end.y - lineB.start.y) * (lineA.start.x - lineB.start.x)
  const nb =
    (lineA.end.x - lineA.start.x) * (lineA.start.y - lineB.start.y) -
    (lineA.end.y - lineA.start.y) * (lineA.start.x - lineB.start.x)
  if (denom !== 0) {
    const ua = na / denom
    const ub = nb / denom

    if (ua >= 0.0 && ua <= 1.0 && ub >= 0.0 && ub <= 1.0) {
      return lineA.interpolate(ua)
    }
  }
}
