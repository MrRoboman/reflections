const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 600

let mirror

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
  mirror = new Line(width * 0.6, height * 0.25, width * 0.6, height * 0.75)

  strokeWeight(4)
}

function draw() {
  background(100)

  const ln = new Line(width * 0.5, height * 0.5, mouseX, mouseY)

  const reflectionLines = getReflectionLines(ln, mirror)

  reflectionLines.forEach(ln => ln.draw())
  mirror.draw()
}

function Line(startX, startY, endX, endY) {
  this.start = createVector(startX, startY)
  this.end = createVector(endX, endY)

  this.normal = () => {
    return createVector(this.start, this.end).rotate(HALF_PI)
  }

  this.interpolate = t => {
    return p5.Vector.lerp(this.start, this.end, t)
  }

  this.draw = () => {
    line(this.start.x, this.start.y, this.end.x, this.end.y)
  }
}

function getReflectionLines(sightLine, mirror) {
  const lines = [sightLine]

  const intersection = findIntersection(sightLine, mirror)

  if (!intersection) {
    return lines
  }

  // Temporary line to get the normal, this should be based on the mirror
  const reflectionNormal = createVector(1, 0)
  const reflection = p5.Vector.sub(sightLine.end, intersection).reflect(
    reflectionNormal,
  )
  const start = intersection
  const end = p5.Vector.add(intersection, reflection)
  const ln = new Line(start.x, start.y, end.x, end.y)

  lines.push(ln)

  return lines
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
