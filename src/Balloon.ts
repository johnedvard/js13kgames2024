import { Vector } from "kontra";
import { Particle } from "./Particle";
import { Spring } from "./Spring";

export class Balloon {
  springs: Spring[] = [];
  particles: Particle[] = []; // Store particles for collision detection

  constructor() {
    const numParticles = 10;
    const length = 25;
    const angleStep = (2 * Math.PI) / numParticles;

    // Create particles around the perimeter
    for (let i = 0; i < numParticles; i++) {
      const angle = i * angleStep;
      const x = 150 + length * Math.cos(angle); // Centered at (50, 50)
      const y = 150 + length * Math.sin(angle);
      this.particles.push(new Particle(Vector(x, y)));
    }

    // Create springs between adjacent particles to form the balloon's perimeter
    for (let i = 0; i < numParticles; i++) {
      const nextIndex = (i + 1) % numParticles;
      const spring = new Spring(
        this.particles[i],
        this.particles[nextIndex],
        20
      );
      this.springs.push(spring);
    }
  }

  update() {
    this.springs.forEach((spring) => spring.update());

    // Collision detection and resolution
    const radius = 20;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        const distance = p1.pos.distance(p2.pos);
        const minDistance = radius / 2; // Minimum distance to consider a collision

        if (distance < minDistance) {
          const overlap = minDistance - distance;
          const direction = p1.pos.subtract(p2.pos).normalize();
          p1.pos = p1.pos.add(direction.scale(overlap / 2));
          p2.pos = p2.pos.subtract(direction.scale(overlap / 2));
        }
      }
    }
  }
  render(context: CanvasRenderingContext2D) {
    this.springs.forEach((spring) => spring.render(context));
  }
}
