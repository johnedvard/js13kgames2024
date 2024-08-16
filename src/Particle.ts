import { Vector } from "kontra";

const GRAVITY = Vector(0, 0.002);
export class Particle {
  mass: number = 1;
  velocity: Vector = Vector(0.1, 0);
  force: Vector = Vector(GRAVITY);
  pos: Vector = Vector(0, 0);
  radius: number = 0.5;
  constructor(pos: Vector) {
    this.pos = Vector(pos);
  }
  applyForce(force: Vector) {
    this.force = this.force.add(force);
  }
  update() {
    const acceleration = Vector(
      this.force.x / this.mass,
      this.force.y / this.mass
    );
    this.velocity = this.velocity.add(acceleration);
    this.pos = this.pos.add(this.velocity);
    this.force = Vector(GRAVITY);
  }

  render(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(this.pos.x, this.pos.y, 50, 0, 2 * Math.PI);
    context.fill();
  }
}
