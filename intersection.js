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
