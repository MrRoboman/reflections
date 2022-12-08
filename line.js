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
