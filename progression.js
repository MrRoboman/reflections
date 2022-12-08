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
