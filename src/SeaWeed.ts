import { Vector } from "kontra";
import { Spring } from "./Spring";
import { Particle } from "./Particle";

export class SeaWeed {
  particles: Particle[] = [];
  springs: Spring[] = [];
  numParticles = 3;
  jointLength = 20;
  constructor(private startPos: Vector) {
    this.createParticles();
    this.createSprings();
    setInterval(() => {
      //   this.springs[this.springs.length - 1].p2.applyForce(Vector(0.001, -1));
      this.springs.forEach((spring) => {
        // if (index > 0) {
        spring.p2.applyForce(
          Vector(0.2 - Math.random() * 0.4, -Math.random() * 0.1)
        );
        spring.update();
        // }
      });
      this.particles[0].pos.x = this.startPos.x;
      this.particles[0].pos.y = this.startPos.y;
    }, 50);
  }
  update() {}
  render(context: CanvasRenderingContext2D) {
    if (!this.particles.length) return;
    this.particles.forEach((particles) => {
      particles.render(context);
    });
    this.springs.forEach((spring) => {
      spring.render(context);
    });
    this.renderOutline(context);
  }
  renderOutline(context: CanvasRenderingContext2D) {
    // Create a spline through all the points in theparticles array
    context.save();
    context.beginPath();
    context.moveTo(this.particles[0].pos.x, this.particles[0].pos.y);
    for (let i = 0; i < this.particles.length; i++) {
      context.lineTo(this.particles[i].pos.x, this.particles[i].pos.y);
    }
    context.strokeStyle = "#2a6";
    context.lineWidth = 2;
    context.stroke();
    context.restore();
  }

  createParticles() {
    for (let i = 0; i < this.numParticles; i++) {
      const y = this.startPos.y - this.jointLength * i;
      const particle = new Particle(Vector(this.startPos.x, y));
      this.particles.push(particle);
    }
    // this.particles[this.particles.length - 1].velocity = Vector(1, -2);
  }
  createSprings() {
    // Create springs between adjacent particles to form the balloon's perimeter
    for (let i = 0; i < this.numParticles; i++) {
      const nextIndex = (i + 1) % this.numParticles;
      const spring = new Spring(
        this.particles[i],
        this.particles[nextIndex],
        this.jointLength,
        0.5,
        { ignoreSelfCollision: true }
      );
      this.springs.push(spring);
    }
  }
}
