import { lerp, Vector } from "kontra";

export class SceneTransition {
  private targetY = -10;
  private lerpFactor = 0.09;
  pos = Vector(0, 0);
  private state: "fadein" | "fadeout" | "comeplete" = "fadein";
  constructor(private canvas: HTMLCanvasElement) {
    this.pos.y = canvas.height;
  }

  getState() {
    return this.state;
  }

  update() {
    // lerp will "never" reach target, so reduce by a small margin
    if (this.pos.y - 2 >= this.targetY) {
      this.pos.y = lerp(this.pos.y, this.targetY, this.lerpFactor);
    } else {
      this.pos.y = lerp(
        this.pos.y,
        this.targetY - this.canvas.height,
        this.lerpFactor
      );
    }
    this.handleState();
  }

  handleState() {
    if (this.state === "fadein" && this.isFadeInComplete()) {
      this.state = "fadeout";
    } else if (this.state === "fadeout" && this.isFadeOutComplete()) {
      this.state = "comeplete";
    }
  }
  render(context: CanvasRenderingContext2D) {
    const { width, height } = this.canvas;

    // Clear the canvas
    context.save();
    context.clearRect(0, 0, width, height);

    // Draw the black box
    context.fillStyle = "black";
    context.fillRect(0, this.pos.y, width, height);
    context.restore();
  }

  isFadeInComplete() {
    return this.pos.y <= this.targetY;
  }
  isFadeOutComplete() {
    return this.pos.y - 2 <= this.targetY - this.canvas.height;
  }
  reset() {
    this.state = "fadein";
    this.pos.y = this.canvas.height;
  }
}
