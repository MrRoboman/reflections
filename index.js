let currentState = 0

let tri
let sightLine
let rooms = [0]
let animatedLines = []

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
  rectMode(CENTER)
  textSize(24)
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

function isSightLineVisible() {
  return (
    states[currentState].sightLineVisible && mouseY <= ROOM_Y + ROOM_H * 0.5
  )
}

function drawStartButton() {
  stroke(0)
  fill(255)
  rect(BUTTON_X, BUTTON_Y, BUTTON_W, BUTTON_H)
  fill(0)
  noStroke()
  text(states[currentState].startButtonText, BUTTON_X, BUTTON_Y)
}

function drawEye() {
  let pupilPosition = states[currentState].pupilPosition

  if (pupilPosition) {
    // Static pupil position
    pupilPosition = createVector(
      ROOM_X + pupilPosition.x * (EYE_BALL_SIZE / 2 - EYE_IRIS_SIZE / 2 - 4),
      ROOM_Y +
        ROOM_H / 2 +
        pupilPosition.y * (EYE_BALL_SIZE / 2 - EYE_IRIS_SIZE / 2 - 4),
    )
  } else {
    // Follow mouse
    const mousePosition = createVector(mouseX, mouseY)
    const eyePosition = createVector(ROOM_X, ROOM_Y + ROOM_H / 2)
    const eyeToMouse = p5.Vector.sub(mousePosition, eyePosition)
    const eyeToMouseDirection = eyeToMouse.normalize()
    const eyeToMouseDistance = eyePosition.dist(mousePosition)
    let distancePercentage = eyeToMouseDistance / EYE_MAX_MOUSE_DISTANCE
    distancePercentage = Math.min(distancePercentage, 1)

    pupilPosition = p5.Vector.add(
      eyePosition,
      eyeToMouseDirection.mult(
        (EYE_BALL_SIZE / 2 - EYE_IRIS_SIZE / 2 - 4) * distancePercentage,
      ),
    )
  }

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

function gotoNextState() {
  currentState++
  if (currentState >= states.length) currentState = 0

  // Reset Triangle
  tri.dragging = false
  if (states[currentState].trianglePosition) {
    const { x, y } = states[currentState].trianglePosition
    tri.x = x
    tri.y = y
  }

  // Set up rooms
  rooms = states[currentState].rooms

  // Generate Animated Lines
  animatedLines = []
  states[currentState].animatedLines.forEach(ln => {
    const al = new AnimatedLine(
      ln.startX,
      ln.startY,
      ln.endX,
      ln.endY,
      ln.animation,
      ln.style,
    )
    al.start()
    animatedLines.push(al)
  })

  // HACK: This is a hack to get the animation to loop
  if (currentState === 4) {
    const loopAnim = () => {
      animatedLines.forEach(ln => ln.start())
      console.log('loop')
      if (currentState === 4) setTimeout(loopAnim, 1500)
    }
    setTimeout(loopAnim, 1500)
  }

  // HACK: This is a hack to get the animation to loop
  if (currentState === 9) {
    const loopAnim = () => {
      animatedLines.forEach(ln => ln.start())
      console.log('loop')
      if (currentState === 9) setTimeout(loopAnim, 2750)
    }
    setTimeout(loopAnim, 2750)
  }
}

function buttonClicked() {
  if (
    states[currentState].startButtonVisible &&
    mouseX >= BUTTON_X - BUTTON_W / 2 &&
    mouseX <= BUTTON_X + BUTTON_W / 2 &&
    mouseY >= BUTTON_Y - BUTTON_H / 2 &&
    mouseY <= BUTTON_Y + BUTTON_H / 2
  ) {
    if (states[currentState].toGetToNextState === 'clickStartButton') {
      gotoNextState()
    }
  }
}

function triangleClicked() {
  if (states[currentState].toGetToNextState === 'clickTriangle') {
    gotoNextState()
  }
}

function triangleReflectionClicked() {
  if (states[currentState].toGetToNextState === 'clickTriangleReflection') {
    gotoNextState()
  }
}

function triangleOnTarget() {
  if (states[currentState].toGetToNextState === 'triangleOnTarget') {
    gotoNextState()
  }
}

function clickClickRect() {
  if (states[currentState].toGetToNextState === 'clickClickRect') {
    console.log(currentState)
    states[currentState].clickRects.forEach(rect => {
      if (
        mouseX >= rect.x - rect.w / 2 &&
        mouseX <= rect.x + rect.w / 2 &&
        mouseY >= rect.y - rect.h / 2 &&
        mouseY <= rect.y + rect.h / 2
      ) {
        gotoNextState()
      }
    })
  }
}

function mousePressed() {
  tri.click()
  buttonClicked()
  clickClickRect()
}

function mouseReleased() {
  tri.unClick()
}

function Triangle(x, y, w, h) {
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
      if (states[currentState].canMoveTriangle) {
        this.dragging = true
        this.offsetX = this.x - mouseX
        this.offsetY = this.y - mouseY
      }
      triangleClicked()
    }

    // HACK: Only detects the reflection in room with index 1
    if (
      mouseX > this.x - this.w / 2 + ROOM_W &&
      mouseX < this.x + this.w / 2 + ROOM_W &&
      mouseY > this.y - this.h / 2 &&
      mouseY < this.y + this.h / 2
    ) {
      triangleReflectionClicked()
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

      if (states[currentState].target) {
        const target = states[currentState].target
        const targetX = target.x + ROOM_X
        const targetY = target.y + ROOM_Y
        const targetW = target.w
        const targetH = target.h
        if (
          target.x > this.x - this.w / 2 &&
          target.x < this.x + this.w / 2 &&
          target.y > this.y - this.h / 2 &&
          target.y < this.y + this.h / 2
        ) {
          triangleOnTarget()
        }
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

function AnimatedLine(
  startX,
  startY,
  endX,
  endY,
  animation,
  style = 'solid',
  timeline = null,
) {
  this.line = new Line(startX, startY, endX, endY)
  this.style = style
  this.progress = 0
  this.isPlaying = false

  this.start = () => {
    // if (!this.isPlaying) {
    this.progress = 0
    this.isPlaying = true
    gsap.to(this, {
      progress: 1,
      onComplete: () => {
        // this.stop()
      },
      ...animation,
    })
    // }
  }

  this.stop = () => {
    this.isPlaying = false
    this.progress = 0
  }

  this.draw = () => {
    if (this.style === 'dashed') {
      drawingContext.setLineDash([10])
    }
    const interpolatedPoint = this.line.interpolate(this.progress)
    line(
      this.line.start.x,
      this.line.start.y,
      interpolatedPoint.x,
      interpolatedPoint.y,
    )
    drawingContext.setLineDash([])
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
    fill(230, 0, 0, getAlpha(roomIdx))

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
