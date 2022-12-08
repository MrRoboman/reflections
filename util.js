function getAlpha(roomIdx) {
  return 255 * Math.pow(LIGHT_FALLOFF, Math.abs(roomIdx))
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

function isSightLineVisible() {
  return (
    states[currentState].sightLineVisible && mouseY <= ROOM_Y + ROOM_H * 0.5
  )
}
