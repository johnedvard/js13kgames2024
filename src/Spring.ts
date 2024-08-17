import { Vector } from "kontra";
import { Particle } from "./Particle";
import { RigidBody } from "./RigidBody";

export class Spring {
  p1: Particle;
  p2: Particle;
  length: number = 1;
  stiffness: number = 0.05;
  damping: number = 0.4;
  normalVector: Vector = Vector(0, 0);

  constructor(p1: Particle, p2: Particle, length: number, stiffness = 0.05) {
    this.p1 = p1;
    this.p2 = p2;
    this.length = length;
    this.stiffness = stiffness;
  }

  hookesLaw() {
    const dx = this.p2.pos.x - this.p1.pos.x;
    const dy = this.p2.pos.y - this.p1.pos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this.normalVector = Vector(dy, -dx).normalize();
    const force = (distance - this.length) * this.stiffness;

    const fx = force * (dx / distance);
    const fy = force * (dy / distance);

    this.p1.applyForce(Vector(fx, fy));
    this.p2.applyForce(Vector(-fx, -fy));

    const dvx = this.p2.velocity.x - this.p1.velocity.x;
    const dvy = this.p2.velocity.y - this.p1.velocity.y;
    const dampingForceX = dvx * this.damping;
    const dampingForceY = dvy * this.damping;

    this.p1.applyForce(Vector(dampingForceX, dampingForceY));
    this.p2.applyForce(Vector(-dampingForceX, -dampingForceY));
  }

  update() {
    this.hookesLaw();
    this.p1.update();
    this.p2.update();
  }

  render<T>(context: CanvasRenderingContext2D, parent?: T) {
    if (parent instanceof RigidBody) {
      context.beginPath();
      context.moveTo(this.p1.pos.x, this.p1.pos.y);
      context.lineTo(this.p2.pos.x, this.p2.pos.y);
      context.strokeStyle = "#abc";
      context.lineWidth = 3;
      context.stroke();
    }

    this.p1.render(context);
    this.p2.render(context);
    this.renderNormalVector(context);
  }

  renderNormalVector(context: CanvasRenderingContext2D) {
    const midX = (this.p1.pos.x + this.p2.pos.x) / 2;
    const midY = (this.p1.pos.y + this.p2.pos.y) / 2;
    const normalVectorLength = 20;

    const normalVectorEndX = midX + this.normalVector.x * normalVectorLength;
    const normalVectorEndY = midY + this.normalVector.y * normalVectorLength;

    context.beginPath();
    context.moveTo(midX, midY);
    context.lineTo(normalVectorEndX, normalVectorEndY);
    context.stroke();
  }
}
