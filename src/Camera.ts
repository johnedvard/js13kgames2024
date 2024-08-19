import { lerp, Vector } from "kontra";

export class Camera {
  pos: Vector = Vector(0, 0);
  canvas: HTMLCanvasElement;
  width: number = 0;
  height: number = 0;
  lerpFactor: number = 0.04; // Adjust this value to control the lerp speed
  skipFrame: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  setPosition(pos: Vector) {
    this.skipFrame = true;
    this.pos = Vector(pos);
  }

  follow(targetPos: Vector) {
    const targetX = targetPos.x - this.width / 2;
    const targetY = targetPos.y - this.height / 2;

    if (this.skipFrame) return;
    // Apply lerp to the camera position
    this.pos = Vector(
      lerp(this.pos.x, targetX, this.lerpFactor),
      lerp(this.pos.y, targetY, this.lerpFactor)
    );
  }

  apply(context: CanvasRenderingContext2D) {
    context.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    context.translate(-this.pos.x, -this.pos.y); // Apply camera translation
    this.skipFrame = false;
  }

  clear(context: CanvasRenderingContext2D) {
    // Adding a margin to clear the canvas

    context.clearRect(
      -2000 + this.pos.x,
      -2000 + this.pos.y,
      this.canvas.width + 4000,
      this.canvas.height + 4000
    );
  }
}
