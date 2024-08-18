import { Vector } from "kontra";
import { Balloon } from "./Balloon";
import { projectPointOntoSegment, rayIntersectsSegment } from "./mathUtils";
import { Particle } from "./Particle";
import { Spring } from "./Spring";

export function handleCollision(objects: any[]) {
  let closestPointOnLine: Vector | null = null;
  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    if (!object.particles) continue;
    object.particles.forEach((particle: Particle) => {
      let intersections = 0;
      for (let j = 0; j < objects.length; j++) {
        if (i !== j) {
          const otherObject = objects[j];
          if (!otherObject.springs) continue;
          otherObject.springs.forEach((spring: Spring) => {
            if (
              object instanceof Balloon &&
              rayIntersectsSegment(particle.pos, spring.p1.pos, spring.p2.pos)
            ) {
              intersections++;
            }
            const tmpClosestPoint = projectPointOntoSegment(
              particle.pos,
              spring.p1.pos,
              spring.p2.pos
            );
            if (
              !closestPointOnLine ||
              tmpClosestPoint.distance(particle.pos) <
                closestPointOnLine.distance(particle.pos)
            ) {
              closestPointOnLine = tmpClosestPoint;
            }
          });
        }
      }

      if (intersections % 2 === 1 && closestPointOnLine) {
        // Particle is inside another object
        particle.pos = Vector(closestPointOnLine);
        particle.velocity = particle.velocity.scale(-1); // adjust the velocity to simulate a bounce
      }
    });
  }
}
