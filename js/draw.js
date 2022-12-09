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
      const mirrorIdx = Math.abs(roomIdx < 0 ? roomIdx + 1 : roomIdx)
      const greyValue = mirrorIdx * 60
      stroke(greyValue)
      line(
        roomX + ROOM_W / 2,
        ROOM_Y - ROOM_H / 2,
        roomX + ROOM_W / 2,
        ROOM_Y + ROOM_H / 2,
      )
    }
  }
}
