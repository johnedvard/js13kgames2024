import { Vector } from "kontra";

export function rayIntersectsSegment(
  p: Vector,
  p1: Vector,
  p2: Vector
): boolean {
  const x = p.x;
  let y = p.y;
  let x1 = p1.x;
  let y1 = p1.y;
  let x2 = p2.x;
  let y2 = p2.y;

  if (y1 > y2) {
    [x1, x2] = [x2, x1];
    [y1, y2] = [y2, y1];
  }

  if (y === y1 || y === y2) y += 0.0001;

  if (y < y1 || y > y2) return false;
  if (x > Math.max(x1, x2)) return false;
  if (x < Math.min(x1, x2)) return true;

  const red = (y - y1) / (x - x1);
  const blue = (y2 - y1) / (x2 - x1);
  return red >= blue;
}

/**
 * Projects a point onto a line segment and returns the closest point on the segment.
 */
export function projectPointOntoSegment(
  point: Vector,
  segmentStart: Vector,
  segmentEnd: Vector
): Vector {
  const segmentVector = segmentEnd.subtract(segmentStart);
  const pointVector = point.subtract(segmentStart);
  const segmentLengthSquared = segmentVector.dot(segmentVector);
  const t = Math.max(
    0,
    Math.min(1, pointVector.dot(segmentVector) / segmentLengthSquared)
  );
  return segmentStart.add(segmentVector.scale(t));
}

export function catmullRomSpline(
  p0: Vector,
  p1: Vector,
  p2: Vector,
  p3: Vector,
  t: number
) {
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x:
      0.5 *
      (2 * p1.x +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y:
      0.5 *
      (2 * p1.y +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  };
}

export function isPointInsideCircle(
  point: Vector,
  center: Vector,
  radius: number
): boolean {
  const distanceSquared = point.distance(center) * point.distance(center);
  return distanceSquared <= radius * radius;
}

export function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}
