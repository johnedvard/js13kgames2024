import { Vector } from "kontra";
import { Particle } from "./Particle";
import { Spring } from "./Spring";
import { getCenterPoint } from "./mathUtils";
import { getColorBasedOnGasAmount } from "./colorUtils";

export type RigidBodyOptions = {
  speed?: Vector;
  path?: Vector; // the path is the distance the rigid body will from its original position
  direction?: number;
  stiffness?: number;
  gravity?: Vector;
};

export class RigidBody {
  pos: Vector;
  startPos: Vector;
  speed: Vector;
  path: Vector;
  particles: Particle[] = [];
  springs: Spring[] = [];
  maxHaltTime = 3000;
  ellapsedHaltTime = this.maxHaltTime + 1;
  centerPoint = Vector(0, 0);
  initialCenterPoint = Vector(0, 0);
  direction = 1;
  stiffness = 1;
  gravity = Vector(0, 0);

  constructor(particlePos: Vector[], options: RigidBodyOptions = {}) {
    this.stiffness = options.stiffness || 1;
    this.startPos = particlePos[0];
    this.pos = particlePos[0];
    this.gravity = options?.gravity ? Vector(options.gravity) : Vector(0, 0);
    this.path = options.path ? Vector(options.path) : Vector(0, 0);
    this.speed = options.speed ? Vector(options.speed) : Vector(0, 0);
    this.direction = options.direction || 0;
    console.log(this.direction);
    particlePos.forEach((pos) => {
      const p = new Particle(Vector(pos));
      p.setSpeed(this.speed.scale(this.direction));
      this.particles.push(p);
    });
    this.initialCenterPoint = getCenterPoint(this.particles);
    particlePos.forEach((pos, index) => {
      const nextIndex = (index + 1) % particlePos.length;
      const width = pos.distance(particlePos[nextIndex]);
      this.springs.push(
        new Spring(
          this.particles[index],
          this.particles[nextIndex],
          width,
          this.stiffness
        )
      );
    });
  }

  handlePathMovement() {
    if (!this.path.x && !this.path.y) return;
    this.ellapsedHaltTime += 1000 / 60;
    if (this.ellapsedHaltTime <= this.maxHaltTime) {
      this.particles.forEach((particle) => {
        particle.setSpeed(Vector(0, 0));
      });
      return;
    }
    const currentPos = this.particles[0].pos;
    const diff = currentPos.subtract(this.startPos);

    if (
      diff.x >= this.path.x &&
      diff.y >= this.path.y &&
      this.direction === 1
    ) {
      this.ellapsedHaltTime = 0;
      this.direction = -1;
    } else if (
      diff.x <= -this.path.x &&
      diff.y <= -this.path.y &&
      this.direction === -1
    ) {
      this.ellapsedHaltTime = 0;
      this.direction = 1;
    }
    this.particles.forEach((particle) => {
      particle.setSpeed(this.speed.scale(this.direction));
    });
  }

  update() {
    this.handlePathMovement();
    // Update the position of the rigid body
    this.particles.forEach((particle) => {
      particle.applyForce(this.gravity);
      particle.update();
    });

    this.centerPoint = getCenterPoint(this.particles);
  }
  render(context: CanvasRenderingContext2D) {
    this.particles.forEach((particle) => {
      particle.render(context);
    });
    this.springs.forEach((spring) => {
      spring.render(context, this);
    });

    this.renderRigidBody(context);
    this.renderPath(context);
  }
  renderRigidBody(context: CanvasRenderingContext2D) {
    if (!this.particles.length) return;
    context.save();
    context.beginPath();

    // Move to the first particle
    context.moveTo(this.particles[0].pos.x, this.particles[0].pos.y);

    // Draw lines to each subsequent particle
    for (let i = 1; i < this.particles.length; i++) {
      context.lineTo(this.particles[i].pos.x, this.particles[i].pos.y);
    }

    // Close the path and fill the shape
    context.closePath();
    context.fillStyle = "rgba(255, 255, 255, 0.1)";
    context.fill();

    context.restore();
  }
  renderPath(context: CanvasRenderingContext2D) {
    if (!this.path) return;
    context.save();
    context.beginPath();
    context.strokeStyle = getColorBasedOnGasAmount(50000);
    context.moveTo(
      this.initialCenterPoint.x - this.path.x,
      this.initialCenterPoint.y - this.path.y
    );
    context.lineTo(
      this.initialCenterPoint.x + this.path.x,
      this.initialCenterPoint.y - this.path.y
    );
    context.stroke();
    context.restore();
  }
}
