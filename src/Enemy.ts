import { Vector } from "kontra";
import { Particle } from "./Particle";
import { Spring } from "./Spring";

export class Enemy {
  center;
  radius;
  numSections;
  particles: Particle[] = [];
  springs: Spring[] = [];
  constructor(startPos: Vector) {
    this.center = startPos;
    this.radius = 100; // Radius of the circle
    this.numSections = 13; // Number of sections
    this.particles = [];
    this.springs = [];

    this.createCircle();
  }

  createCircle() {
    const angleIncrement = (2 * Math.PI) / this.numSections;

    for (let i = 0; i < this.numSections; i++) {
      const angle = i * angleIncrement;
      const x = this.center.x + this.radius * Math.cos(angle);
      const y = this.center.y + this.radius * Math.sin(angle);
      const particle1 = new Particle(Vector(x, y));
      const particle2 = new Particle(
        Vector(x, y).add(Vector(10 * Math.cos(angle), 10 * Math.sin(angle)))
      );
      this.particles.push(particle1);
      this.particles.push(particle2);
      const spring = new Spring(particle1, particle2, this.radius, 1);
      this.springs.push(spring);
    }
  }

  render(context: CanvasRenderingContext2D) {
    this.springs.forEach((spring) => {
      spring.render(context);
    });
    context.save();

    context.beginPath();
    context.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
    context.stroke();

    context.restore();
  }

  update() {
    // Update particles and springs
    // this.particles.forEach((particle) => particle.update());
    this.springs.forEach((spring) => spring.update());
  }
}
