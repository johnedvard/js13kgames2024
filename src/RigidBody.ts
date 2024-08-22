import { Vector } from "kontra";
import { Particle } from "./Particle";
import { Spring } from "./Spring";

export class RigidBody {
  pos: Vector;
  particles: Particle[] = [];
  springs: Spring[] = [];

  constructor(particlePos: Vector[]) {
    this.pos = particlePos[0];
    particlePos.forEach((pos) => {
      this.particles.push(new Particle(Vector(pos)));
    });
    particlePos.forEach((pos, index) => {
      const nextIndex = (index + 1) % particlePos.length;
      const width = pos.distance(particlePos[nextIndex]);
      this.springs.push(
        new Spring(this.particles[index], this.particles[nextIndex], width, 1)
      );
    });
  }

  update() {
    // Update the position of the rigid body
  }
  render(context: CanvasRenderingContext2D) {
    this.particles.forEach((particle) => {
      particle.render(context);
    });

    this.springs.forEach((spring) => {
      spring.render(context, this);
    });
  }
}
