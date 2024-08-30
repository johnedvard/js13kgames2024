import { Vector } from "kontra";
import { RigidBody } from "./RigidBody";
import { getColorBasedOnGasAmount } from "./colorUtils";

export class Spike {
  rigidBody: RigidBody;
  startPos: Vector;
  isSpike = true;
  constructor(startPos: Vector) {
    this.startPos = startPos;
    const triangleVertices = [
      Vector(0, 0).add(startPos),
      Vector(25, 50).add(startPos),
      Vector(-25, 50).add(startPos),
    ];
    this.rigidBody = new RigidBody(triangleVertices, {
      stiffness: 0.1,
      gravity: Vector(0, 0.01),
    });
  }
  update() {
    this.rigidBody.update();
  }

  render(context: CanvasRenderingContext2D) {
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
    context.fillStyle = getColorBasedOnGasAmount(130000);
    context.fill();

    context.restore();
    this.rigidBody.render(context);
  }

  get springs() {
    return this.rigidBody.springs;
  }

  get particles() {
    return this.rigidBody.particles;
  }
}
