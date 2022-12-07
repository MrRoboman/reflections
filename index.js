const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 800

const OBJECT_BOUNDARIES = {
  left: CANVAS_WIDTH * 0.4,
  right: CANVAS_WIDTH * 0.6,
  top: CANVAS_HEIGHT * 0.1,
  bottom: CANVAS_HEIGHT * 0.5,
}

let obj
let mirrors
let objs

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
  rectMode(CENTER)

  mirrors = [
    // new Line(width * 0.4, height * 0.1, width * 0.4, height * 0.5),
    new Line(width * 0.6, height * 0.1, width * 0.6, height * 0.5),
  ]

  generateObjects(width * 0.5, height * 0.25, 50, 50, mirrors)

  strokeWeight(4)
}

function draw() {
  objs.forEach(o => o.update())

  stroke(0)
  fill(255)
  background(100)

  const ln = new Line(width * 0.5, height * 0.5, mouseX, mouseY)

  const reflectionLines = getReflectionLines(ln, mirrors)

  drawingContext.setLineDash([10])
  // ln.draw()

  drawingContext.setLineDash([])
  // reflectionLines.forEach(ln => ln.draw())

  mirrors.forEach(m => m.draw())

  objs.forEach(o => o.draw())

  stroke(0, 0, 0, 255 * 0.5)
  fill(255, 255, 255, 255 * 0.5)
  // reflectedObjects.forEach(o => o.draw())
}

function mousePressed() {
  objs.forEach(o => o.click())
}

function mouseReleased() {
  objs.forEach(o => o.unClick())
}

function DraggableObject(x, y, w, h, left, right, top, bottom, isReversedX) {
  this.x = x
  this.y = y
  this.w = w
  this.h = h

  this.boundaries = { left, right, top, bottom }

  this.isReversedX = isReversedX

  this.dragging = false
  this.offsetX = 0
  this.offsetY = 0

  this.click = () => {
    if (
      mouseX > this.x - this.w / 2 &&
      mouseX < this.x + this.w / 2 &&
      mouseY > this.y - this.h / 2 &&
      mouseY < this.y + this.h / 2
    ) {
      this.dragging = true
      this.offsetX = this.x - mouseX
      this.offsetY = this.y - mouseY
    }
  }

  this.unClick = () => {
    this.dragging = false
  }

  this.update = () => {
    if (this.dragging) {
      this.x = mouseX + this.offsetX
      this.y = mouseY + this.offsetY

      if (this.boundaries.left && this.x - this.w / 2 < this.boundaries.left) {
        this.x = this.boundaries.left + this.w / 2
      }
      if (
        this.boundaries.right &&
        this.x + this.w / 2 > this.boundaries.right
      ) {
        this.x = this.boundaries.right - this.w / 2
      }
      if (this.boundaries.top && this.y - this.h / 2 < this.boundaries.top) {
        this.y = this.boundaries.top + this.h / 2
      }
      if (
        this.boundaries.bottom &&
        this.y + this.h / 2 > this.boundaries.bottom
      ) {
        this.y = this.boundaries.bottom - this.h / 2
      }

      updateOtherObjects(this)
    }
  }

  this.draw = () => {
    rect(this.x, this.y, this.w, this.h)
  }
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

function updateOtherObjects(obj) {
  objs.forEach(o => {
    if (o !== obj) {
      if (
        (o.isReversedX && !obj.isReversedX) ||
        (!o.isReversedX && obj.isReversedX)
      ) {
        o.x = o.boundaries.right - (obj.x - obj.boundaries.left)
      } else {
        o.x = o.boundaries.left + (obj.x - obj.boundaries.left)
      }
      o.y = obj.y
    }
  })
}

function generateObjects(x, y, w, h, mirrors) {
  const obj = new DraggableObject(
    x,
    y,
    w,
    h,
    OBJECT_BOUNDARIES.left,
    OBJECT_BOUNDARIES.right,
    OBJECT_BOUNDARIES.top,
    OBJECT_BOUNDARIES.bottom,
  )

  objs = [obj]

  const mirror = mirrors[0]
  const obj2 = new DraggableObject(
    mirror.start.x + (mirror.start.x - obj.x),
    obj.y,
    w,
    h,
    mirror.start.x,
    mirror.start.x + (OBJECT_BOUNDARIES.right - OBJECT_BOUNDARIES.left),
    OBJECT_BOUNDARIES.top,
    OBJECT_BOUNDARIES.bottom,
    true,
  )

  objs.push(obj2)
}

function getReflectionLines(sightLine, mirrors, ignoreMirror) {
  for (let i = 0; i < mirrors.length; i++) {
    const mirror = mirrors[i]

    if (mirror === ignoreMirror) {
      continue
    }

    const intersection = findIntersection(sightLine, mirror)

    if (intersection) {
      const firstHalfOfLine = new Line(
        sightLine.start.x,
        sightLine.start.y,
        intersection.x,
        intersection.y,
      )

      // TODO: This assumes the mirror is vertical, normal should be based on the angle of the mirror.
      const reflectionNormal = createVector(1, 0)

      const reflection = p5.Vector.sub(sightLine.end, intersection).reflect(
        reflectionNormal,
      )

      const end = p5.Vector.add(intersection, reflection)
      const reflectedHalfOfLine = new Line(
        intersection.x,
        intersection.y,
        end.x,
        end.y,
      )

      return [firstHalfOfLine].concat(
        getReflectionLines(reflectedHalfOfLine, mirrors, mirror),
      )
    }
  }

  return [sightLine]
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
      console.log('fart')
      return lineA.interpolate(ua)
    }
  }
}
