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
