import { Vector } from "kontra";

const GRAVITY = Vector(0, 0);
const MAX_SPEED = 8;

export class Particle {
  mass: number = 1;
  velocity: Vector = Vector(0, 0);
  force: Vector = Vector(GRAVITY);
  pos: Vector = Vector(0, 0);
  radius: number = 0.5;
  baseSpeed = Vector(0, 0);
  constructor(pos: Vector) {
    this.pos = Vector(pos);
  }
  // need to apply force, because of Hookes Law
  applyForce(force: Vector) {
    this.force = this.force.add(force);
  }

  setSpeed(speed: Vector) {
    this.baseSpeed = Vector(speed);
    this.velocity = Vector(speed);
  }
  update() {
    const acceleration = Vector(
      this.force.x / this.mass,
      this.force.y / this.mass
    );
    this.velocity = this.velocity.add(acceleration).add(this.baseSpeed);
    this.velocity.clamp(-MAX_SPEED, -MAX_SPEED, MAX_SPEED, MAX_SPEED);

    this.pos = this.pos.add(this.velocity);

    this.force = Vector(GRAVITY);
  }

  render(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(this.pos.x, this.pos.y, 5, 0, 2 * Math.PI);
    context.fillStyle = "#abc";
    context.fill();
  }
}
