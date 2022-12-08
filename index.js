const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 400

const ROOM_W = 150
const ROOM_H = 300
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

const START_BUTTON_X = CANVAS_WIDTH * 0.5
const START_BUTTON_Y = CANVAS_HEIGHT - 20
const START_BUTTON_W = 150
const START_BUTTON_H = 30

const TRIANGLE_SIZE = 20

const LIGHT_FALLOFF = 0.75

let currentState = 7
const states = [
  // 0
  {
    animatedLines: [],
    canMoveTriangle: false,
    clickRects: null,
    prompt: "Let's learn about light!",
    pupilPosition: null,
    rooms: [0],
    sightLineVisible: false,
    startButtonText: 'Start',
    startButtonVisible: true,
    target: null,
    toGetToNextState: 'clickStartButton',
    trianglePosition: null,
  },
  // 1
  {
    animatedLines: [],
    canMoveTriangle: false,
    clickRects: null,
    rooms: [0],
    prompt: 'Look at the triangle in the middle of the room.',
    pupilPosition: null,
    sightLineVisible: true,
    startButtonText: '',
    startButtonVisible: false,
    target: null,
    toGetToNextState: 'clickTriangle',
    trianglePosition: null,
  },
  // 2
  {
    animatedLines: [
      {
        startX: ROOM_X,
        startY: 165,
        endX: ROOM_X,
        endY: 270,
        animation: {
          duration: 0.5,
          ease: 'power3.inOut',
          repeat: -1,
          repeatDelay: 0.5,
        },
      },
    ],
    canMoveTriangle: false,
    clickRects: null,
    rooms: [0],
    prompt: 'Great! Light reflects off the triangle into your eye.',
    pupilPosition: { x: 0, y: -1 },
    sightLineVisible: false,
    startButtonText: 'Add mirror',
    startButtonVisible: true,
    target: null,
    toGetToNextState: 'clickStartButton',
    trianglePosition: null,
  },
  // 3
  {
    animatedLines: [],
    canMoveTriangle: false,
    clickRects: null,
    rooms: [0, 1],
    prompt: "Look at the triangle's reflection.",
    pupilPosition: null,
    sightLineVisible: true,
    startButtonText: '',
    startButtonVisible: false,
    target: null,
    toGetToNextState: 'clickTriangleReflection',
    trianglePosition: null,
  },
  // 4
  {
    animatedLines: [
      {
        startX: 535,
        startY: 165,
        endX: 475,
        endY: 225,
        animation: {
          duration: 0.5,
          ease: 'power3.inOut',
          repeat: -1,
          repeatDelay: 1,
        },
        style: 'dashed',
      },
      {
        startX: 415,
        startY: 165,
        endX: 475,
        endY: 225,
        animation: {
          duration: 0.5,
          ease: 'power3.inOut',
          repeat: -1,
          repeatDelay: 1,
        },
      },
      {
        startX: 475,
        startY: 225,
        endX: 425,
        endY: 280,
        animation: {
          delay: 0.5,
          duration: 0.5,
          ease: 'power3.inOut',
          repeat: -1,
          repeatDelay: 1,
        },
      },
    ],
    canMoveTriangle: false,
    clickRects: null,
    rooms: [0, 1],
    prompt:
      'Nice! What do you notice about the angles of the reflecting light?',
    pupilPosition: { x: 0.75, y: -0.75 },
    sightLineVisible: false,
    startButtonText: 'Next',
    startButtonVisible: true,
    target: null,
    toGetToNextState: 'clickStartButton',
    trianglePosition: null,
  },
  // 5
  {
    animatedLines: [
      {
        startX: 485,
        startY: 15,
        endX: 475,
        endY: 40,
        animation: {
          duration: 0.1,
          ease: 'power3.inOut',
        },
        style: 'dashed',
      },
      {
        startX: 460,
        startY: 15,
        endX: 475,
        endY: 40,
        animation: {
          duration: 0.1,
          ease: 'power3.inOut',
        },
      },
      {
        startX: 475,
        startY: 40,
        endX: 410,
        endY: 270,
        animation: {
          duration: 0.1,
          ease: 'power3.inOut',
        },
      },
    ],
    canMoveTriangle: true,
    clickRects: null,
    rooms: [0, 1],
    prompt:
      "Make the eye look at the triangle's reflection by moving the triangle",
    pupilPosition: { x: 0.4, y: -0.9 },
    sightLineVisible: false,
    startButtonText: '',
    startButtonVisible: false,
    target: { x: 450, y: 25 },
    toGetToNextState: 'triangleOnTarget',
    trianglePosition: null,
  },
  // 6
  {
    animatedLines: [],
    canMoveTriangle: false,
    clickRects: null,
    rooms: [0, 1],
    prompt:
      "What's relationship between the triangle's position and it's reflection?",
    pupilPosition: null,
    sightLineVisible: false,
    startButtonText: 'Add mirror',
    startButtonVisible: true,
    target: null,
    toGetToNextState: 'clickStartButton',
    trianglePosition: null,
  },
  // 7
  {
    animatedLines: [],
    canMoveTriangle: true,
    clickRects: [
      {
        x: 95,
        y: 175,
        width: TRIANGLE_SIZE,
        height: TRIANGLE_SIZE,
      },
      {
        x: 695,
        y: 175,
        width: TRIANGLE_SIZE,
        height: TRIANGLE_SIZE,
      },
    ],
    rooms: [-3, -2, -1, 0, 1, 2, 3],
    prompt: 'Two mirrors gives the impression of infinity.',
    pupilPosition: null,
    sightLineVisible: false,
    startButtonText: 'Next',
    startButtonVisible: true,
    target: null,
    toGetToNextState: 'clickStartButton',
    trianglePosition: null,
  },
  // 8
  {
    animatedLines: [],
    canMoveTriangle: false,
    clickRects: [
      {
        x: 100,
        y: 150,
        w: TRIANGLE_SIZE,
        h: TRIANGLE_SIZE,
      },
      // {
      //   x: 700,
      //   y: 150,
      //   w: TRIANGLE_SIZE,
      //   h: TRIANGLE_SIZE,
      // },
    ],
    rooms: [-3, -2, -1, 0, 1, 2, 3],
    prompt: 'Have the eye look at the triangle two reflections to the left.',
    pupilPosition: null,
    sightLineVisible: true,
    startButtonText: '',
    startButtonVisible: false,
    target: null,
    toGetToNextState: 'clickClickRect',
    trianglePosition: { x: ROOM_X, y: ROOM_Y },
  },
  // 9
  //   {startX: 475, startY: 181.3274336283186, endX: 417.5, endY: 151}

  // index.js:554 {startX: 400, startY: 300, endX: 325, endY: 260.17699115044246}

  // index.js:554 {startX: 325, startY: 260.17699115044246, endX: 475, endY: 180.53097345132744}

  // index.js:554 {startX: 475, startY: 180.53097345132744, endX: 417.5, endY: 150}
  {
    animatedLines: [
      {
        startX: 419.5,
        startY: 151.3,
        endX: 475,
        endY: 180.5,
        animation: {
          duration: 0.75,
          ease: 'power3.inOut',
        },
      },
      {
        startX: 419.5 - ROOM_W * 2,
        startY: 151.3,
        endX: 475 - ROOM_W * 2,
        endY: 180.5,
        animation: {
          duration: 0.75,
          ease: 'power3.inOut',
        },
        style: 'dashed',
      },
      {
        startX: 475,
        startY: 180.5,
        endX: 325,
        endY: 260.2,
        animation: {
          delay: 0.75,
          duration: 0.75,
          ease: 'power3.inOut',
        },
      },
      {
        startX: 475 - ROOM_W * 2,
        startY: 180.5,
        endX: 325,
        endY: 260.2,
        animation: {
          delay: 0.75,
          duration: 0.75,
          ease: 'power3.inOut',
        },
        style: 'dashed',
      },
      {
        startX: 325,
        startY: 260.2,
        endX: 372.5,
        endY: 285,
        animation: {
          delay: 1.5,
          duration: 0.75,
          ease: 'power3.inOut',
        },
      },
    ],
    canMoveTriangle: false,
    clickRects: null,
    rooms: [-3, -2, -1, 0, 1, 2, 3],
    prompt: 'Why does the image appear to alternate directions?',
    pupilPosition: null,
    sightLineVisible: false,
    startButtonText: 'Start over',
    startButtonVisible: true,
    target: null,
    toGetToNextState: 'clickStartButton',
    trianglePosition: null,
  },
]

let item
let rooms = [0]
let animatedLines = []
// let rooms = [0, 1]
// let rooms = [-2, -1, 0, 1, 2]
// let rooms = [-3, -2, -1, 0, 1, 2, 3]
// let rooms = [-4, -3, -2, -1, 0, 1, 2, 3, 4]
// let rooms = [
//   -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
// ]

let al
let ln

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
  rectMode(CENTER)
  textSize(24)
  textAlign(CENTER, CENTER)

  item = new ReflectionObject(ROOM_X, ROOM_Y, 20, 20)
  al = new AnimatedLine(10, 10, width - 10, height - 10)
  al.start()
}

function draw() {
  strokeWeight(2)
  item.update()

  background(100)

  ln = new Line(ROOM_X, ROOM_Y + ROOM_H * 0.5, mouseX, mouseY)

  const reflectionLines = getReflectionLines(ln, getMirrors())

  drawRooms()
  item.draw()

  strokeWeight(4)
  stroke(0, 0, 0, 255)

  if (
    states[currentState].sightLineVisible &&
    mouseY <= ROOM_Y + ROOM_H * 0.5
  ) {
    drawingContext.setLineDash([10])
    ln.draw()

    drawingContext.setLineDash([])
    reflectionLines.forEach(ln => ln.draw())
  }

  drawEye()

  text(states[currentState].prompt, width / 2, height - 55)
  if (states[currentState].startButtonVisible) {
    drawStartButton()
  }

  stroke(4)
  animatedLines.forEach(ln => ln.draw())
}

function drawStartButton() {
  stroke(0)
  fill(255)
  rect(START_BUTTON_X, START_BUTTON_Y, START_BUTTON_W, START_BUTTON_H)
  fill(0)
  noStroke()
  // noFill()
  text(states[currentState].startButtonText, START_BUTTON_X, START_BUTTON_Y)
}

function drawEye() {
  let pupilPosition = states[currentState].pupilPosition

  if (pupilPosition) {
    pupilPosition = createVector(
      ROOM_X + pupilPosition.x * (EYE_BALL_SIZE / 2 - EYE_IRIS_SIZE / 2 - 4),
      ROOM_Y +
        ROOM_H / 2 +
        pupilPosition.y * (EYE_BALL_SIZE / 2 - EYE_IRIS_SIZE / 2 - 4),
    )
  } else {
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

function nextState() {
  if (currentState < states.length - 1) {
    currentState++
  } else {
    currentState = 0
  }

  item.dragging = false
  if (states[currentState].trianglePosition) {
    const { x, y } = states[currentState].trianglePosition
    item.x = x
    item.y = y
  }

  rooms = states[currentState].rooms

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

  if (currentState === 9) {
    const loopAnim = () => {
      animatedLines.forEach(ln => ln.start())
      console.log('loop')
      if (currentState === 9) setTimeout(loopAnim, 2750)
    }
    setTimeout(loopAnim, 2750)
  }
}

function clickStartButton() {
  if (
    states[currentState].startButtonVisible &&
    mouseX >= START_BUTTON_X - START_BUTTON_W / 2 &&
    mouseX <= START_BUTTON_X + START_BUTTON_W / 2 &&
    mouseY >= START_BUTTON_Y - START_BUTTON_H / 2 &&
    mouseY <= START_BUTTON_Y + START_BUTTON_H / 2
  ) {
    if (states[currentState].toGetToNextState === 'clickStartButton') {
      nextState()
    }
  }
}

function triangleClicked() {
  if (states[currentState].toGetToNextState === 'clickTriangle') {
    nextState()
  }
}

function triangleReflectionClicked() {
  if (states[currentState].toGetToNextState === 'clickTriangleReflection') {
    nextState()
  }
}

function triangleOnTarget() {
  if (states[currentState].toGetToNextState === 'triangleOnTarget') {
    nextState()
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
        nextState()
      }
    })
  }
}

function mousePressed() {
  // console.log(mouseX, mouseY)
  const refLines = getReflectionLines(ln, getMirrors())
  refLines.forEach(ln => {
    console.log('-------')
    console.log({
      startX: ln.start.x,
      startY: ln.start.y,
      endX: ln.end.x,
      endY: ln.end.y,
    })
  })
  item.click()
  clickStartButton()
  clickClickRect()
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
