const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 400

const ROOM_W = 150
const ROOM_H = 200
const ROOM_X = CANVAS_WIDTH * 0.5
const ROOM_Y = ROOM_H * 0.5

const ROOM_LEFT = ROOM_X - ROOM_W * 0.5
const ROOM_RIGHT = ROOM_X + ROOM_W * 0.5
const ROOM_TOP = ROOM_Y - ROOM_H * 0.5
const ROOM_BOTTOM = ROOM_Y + ROOM_H * 0.5

const EYE_BALL_SIZE = 40
const EYE_IRIS_SIZE = 16
const EYE_PUPIL_SIZE = 6
const EYE_COLOR = '#228b22'
const EYE_MAX_MOUSE_DISTANCE = 100

const LIGHT_FALLOFF = 0.75

let item
// let rooms = [0]
// let rooms = [0, 1]
// let rooms = [-2, -1, 0, 1, 2]
let rooms = [-3, -2, -1, 0, 1, 2, 3]
// let rooms = [-4, -3, -2, -1, 0, 1, 2, 3, 4]
// let rooms = [
//   -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
// ]

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
  rectMode(CENTER)

  item = new ReflectionObject(ROOM_X, ROOM_Y, 20, 20)
}

function draw() {
  strokeWeight(2)
  item.update()

  background(100)

  const ln = new Line(ROOM_X, ROOM_Y + ROOM_H * 0.5, mouseX, mouseY)

  const reflectionLines = getReflectionLines(ln, getMirrors())

  drawRooms()
  item.draw()

  strokeWeight(4)
  stroke(0, 0, 0, 255)

  drawingContext.setLineDash([10])
  ln.draw()

  drawingContext.setLineDash([])
  reflectionLines.forEach(ln => ln.draw())

  drawEye()
}

function drawEye() {
  const mousePosition = createVector(mouseX, mouseY)
  const eyePosition = createVector(ROOM_X, ROOM_Y + ROOM_H / 2)
  const eyeToMouse = p5.Vector.sub(mousePosition, eyePosition)
  const eyeToMouseDirection = eyeToMouse.normalize()
  const eyeToMouseDistance = eyePosition.dist(mousePosition)
  let distancePercentage = eyeToMouseDistance / EYE_MAX_MOUSE_DISTANCE
  distancePercentage = Math.min(distancePercentage, 1)
  const pupilPosition = p5.Vector.add(
    eyePosition,
    eyeToMouseDirection.mult(
      (EYE_BALL_SIZE / 2 - EYE_IRIS_SIZE / 2 - 4) * distancePercentage,
    ),
  )

  stroke(0)
  fill(255)
  circle(ROOM_X, ROOM_Y + ROOM_H / 2, EYE_BALL_SIZE)

  noStroke()
  fill(EYE_COLOR)
  circle(pupilPosition.x, pupilPosition.y, EYE_IRIS_SIZE)

  noStroke()
  fill(0)
  circle(pupilPosition.x, pupilPosition.y, EYE_PUPIL_SIZE)
}

function mousePressed() {
  item.click()
}

function mouseReleased() {
  item.unClick()
}

function ReflectionObject(x, y, w, h) {
  this.x = x
  this.y = y
  this.w = w
  this.h = h

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

      if (this.x - this.w / 2 < ROOM_LEFT) {
        this.x = ROOM_LEFT + this.w / 2
      }
      if (this.x + this.w / 2 > ROOM_RIGHT) {
        this.x = ROOM_RIGHT - this.w / 2
      }
      if (this.y - this.h / 2 < ROOM_TOP) {
        this.y = ROOM_TOP + this.h / 2
      }
      if (this.y + this.h / 2 > ROOM_BOTTOM) {
        this.y = ROOM_BOTTOM - this.h / 2
      }
    }
  }

  this.draw = () => {
    rooms.forEach(roomIdx => {
      const alpha = getAlpha(roomIdx)
      stroke(0, 0, 0, alpha)
      fill(255, 255, 255, alpha)
      const shouldReflectX = Math.abs(roomIdx) % 2 === 1
      let x = this.x + ROOM_W * roomIdx
      if (shouldReflectX) {
        x += (width / 2 - this.x) * 2
      }
      push()
      translate(x, this.y)
      if (shouldReflectX) {
        scale(-1, 1)
      }
      triangle(-this.w / 2, 0, this.w / 2, -this.h / 2, this.w / 2, this.h / 2)
      pop()
    })
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

function getAlpha(roomIdx) {
  return 255 * Math.pow(LIGHT_FALLOFF, Math.abs(roomIdx))
}

function drawRooms() {
  // Draw floors
  for (let i = 0; i < rooms.length; i++) {
    const roomIdx = rooms[i]
    const roomX = ROOM_X + ROOM_W * roomIdx

    noStroke()
    fill(255, 0, 0, getAlpha(roomIdx))

    rect(roomX, ROOM_Y, ROOM_W, ROOM_H)

    if (i < rooms.length - 1) {
      stroke(0)
      line(
        roomX + ROOM_W / 2,
        ROOM_Y - ROOM_H / 2,
        roomX + ROOM_W / 2,
        ROOM_Y + ROOM_H / 2,
      )
    }
  }

  // Draw mirrors
  for (let i = 0; i < rooms.length; i++) {
    const roomIdx = rooms[i]
    const roomX = ROOM_X + ROOM_W * roomIdx

    if (i < rooms.length - 1) {
      stroke(0)
      line(
        roomX + ROOM_W / 2,
        ROOM_Y - ROOM_H / 2,
        roomX + ROOM_W / 2,
        ROOM_Y + ROOM_H / 2,
      )
    }
  }
}

function getMirrors() {
  let mirrors = []
  if (rooms.includes(-1)) {
    mirrors.push(
      new Line(
        ROOM_X - ROOM_W / 2,
        ROOM_Y - ROOM_H / 2,
        ROOM_X - ROOM_W / 2,
        ROOM_Y + ROOM_H / 2,
      ),
    )
  }
  if (rooms.includes(1)) {
    mirrors.push(
      new Line(
        ROOM_X + ROOM_W / 2,
        ROOM_Y - ROOM_H / 2,
        ROOM_X + ROOM_W / 2,
        ROOM_Y + ROOM_H / 2,
      ),
    )
  }

  return mirrors
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
      return lineA.interpolate(ua)
    }
  }
}
