const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 800

const ROOM_WIDTH = 100
const ROOM_HEIGHT = 100

let item
// let rooms = [0]
// let rooms = [0, 1]
let rooms = [-2, -1, 0, 1, 2]
// let rooms = [-3, -2, -1, 0, 1, 2, 3]
// let rooms = [-4, -3, -2, -1, 0, 1, 2, 3, 4]

function drawRooms() {
  // Draw floors
  for (let i = 0; i < rooms.length; i++) {
    const roomIdx = rooms[i]
    const centerX = width * 0.5
    const centerY = height * 0.5
    const roomX = centerX + roomIdx * ROOM_WIDTH
    const roomY = centerY
    noStroke()
    fill(255, 0, 0)
    rect(roomX, roomY, ROOM_WIDTH, ROOM_HEIGHT)
    if (i < rooms.length - 1) {
      stroke(0)
      line(
        roomX + ROOM_WIDTH / 2,
        roomY - ROOM_HEIGHT / 2,
        roomX + ROOM_WIDTH / 2,
        roomY + ROOM_HEIGHT / 2,
      )
    }
  }

  // Draw mirrors
  for (let i = 0; i < rooms.length; i++) {
    const roomIdx = rooms[i]
    const centerX = width * 0.5
    const centerY = height * 0.5
    const roomX = centerX + roomIdx * ROOM_WIDTH
    const roomY = centerY
    if (i < rooms.length - 1) {
      stroke(0)
      line(
        roomX + ROOM_WIDTH / 2,
        roomY - ROOM_HEIGHT / 2,
        roomX + ROOM_WIDTH / 2,
        roomY + ROOM_HEIGHT / 2,
      )
    }
  }
}

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
  rectMode(CENTER)

  item = new ReflectionObject(width * 0.5, height * 0.5, 10, 10)
}

function draw() {
  item.update()

  background(100)

  const ln = new Line(
    width * 0.5,
    height * 0.5 + ROOM_HEIGHT * 0.5,
    mouseX,
    mouseY,
  )

  const reflectionLines = getReflectionLines(ln, getMirrors())

  drawRooms()
  item.draw()

  drawingContext.setLineDash([10])
  ln.draw()

  drawingContext.setLineDash([])
  reflectionLines.forEach(ln => ln.draw())
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
      const centerRoomLeft = width / 2 - ROOM_WIDTH / 2
      const centerRoomRight = width / 2 + ROOM_WIDTH / 2
      const centerRoomTop = height / 2 - ROOM_HEIGHT / 2
      const centerRoomBottom = height / 2 + ROOM_HEIGHT / 2

      this.x = mouseX + this.offsetX
      this.y = mouseY + this.offsetY

      if (this.x - this.w / 2 < centerRoomLeft) {
        this.x = centerRoomLeft + this.w / 2
      }
      if (this.x + this.w / 2 > centerRoomRight) {
        this.x = centerRoomRight - this.w / 2
      }
      if (this.y - this.h / 2 < centerRoomTop) {
        this.y = centerRoomTop + this.h / 2
      }
      if (this.y + this.h / 2 > centerRoomBottom) {
        this.y = centerRoomBottom - this.h / 2
      }
    }
  }

  this.draw = () => {
    rooms.forEach(roomIdx => {
      stroke(0)
      fill(255)
      const shouldReflectX = Math.abs(roomIdx) % 2 === 1
      let x = this.x + ROOM_WIDTH * roomIdx
      if (shouldReflectX) {
        x += (width / 2 - this.x) * 2
      }
      rect(x, this.y, this.w, this.h)
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

function getMirrors() {
  let mirrors = []
  if (rooms.includes(-1)) {
    mirrors.push(
      new Line(
        width * 0.5 - ROOM_WIDTH / 2,
        height * 0.5 - ROOM_HEIGHT / 2,
        width * 0.5 - ROOM_WIDTH / 2,
        height * 0.5 + ROOM_HEIGHT / 2,
      ),
    )
  }
  if (rooms.includes(1)) {
    mirrors.push(
      new Line(
        width * 0.5 + ROOM_WIDTH / 2,
        height * 0.5 - ROOM_HEIGHT / 2,
        width * 0.5 + ROOM_WIDTH / 2,
        height * 0.5 + ROOM_HEIGHT / 2,
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
