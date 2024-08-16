import { Vector } from "kontra";
import { Particle } from "./Particle";
import { Spring } from "./Spring";

export class RigidBody {
  pos: Vector;
  width: number;
  height: number;
  particles: Particle[] = [];
  springs: Spring[] = [];

  constructor(pos: Vector, width: number, height: number) {
    this.pos = pos;
    this.width = width;
    this.height = height;
    this.particles.push(new Particle(Vector(pos.x, pos.y)));
    this.particles.push(new Particle(Vector(pos.x + width, pos.y)));
    this.particles.push(new Particle(Vector(pos.x + width, pos.y + height)));
    this.particles.push(new Particle(Vector(pos.x, pos.y + height)));
    this.springs.push(
      new Spring(this.particles[0], this.particles[1], width, 1)
    );
    this.springs.push(
      new Spring(this.particles[1], this.particles[2], width, 1)
    );
    this.springs.push(
      new Spring(this.particles[2], this.particles[3], width, 1)
    );
    this.springs.push(
      new Spring(this.particles[3], this.particles[0], width, 1)
    );
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
