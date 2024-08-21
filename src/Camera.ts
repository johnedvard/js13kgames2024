import { lerp, Vector } from "kontra";

type FollowOptions = {
  lerp: boolean;
};
export class Camera {
  pos: Vector = Vector(0, 0);
  canvas: HTMLCanvasElement;
  lerpFactor: number = 0.04; // Adjust this value to control the lerp speed
  skipFrame: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.pos = Vector(canvas.width, canvas.height);
  }

  setPosition(pos: Vector) {
    this.skipFrame = true;
    this.pos = Vector(pos);
  }

  follow(targetPos: Vector, options: FollowOptions = { lerp: true }) {
    const targetX = targetPos.x - this.canvas.width / 2;
    const targetY = targetPos.y - this.canvas.height / 2;

    if (this.skipFrame) return;
    if (options.lerp) {
      // Apply lerp to the camera position
      this.pos = Vector(
        lerp(this.pos.x, targetX, this.lerpFactor),
        lerp(this.pos.y, targetY, this.lerpFactor)
      );
    } else {
      this.pos = Vector(targetX, targetY);
    }
  }

  apply(context: CanvasRenderingContext2D) {
    context.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    context.translate(-this.pos.x, -this.pos.y); // Apply camera translation
    this.skipFrame = false;
  }

  clear(context: CanvasRenderingContext2D) {
    // Adding a margin to clear the canvas

    context.clearRect(
      -1000 + this.pos.x,
      -1000 + this.pos.y,
      this.canvas.width + 2000,
      this.canvas.height + 2000
    );
  }
}
