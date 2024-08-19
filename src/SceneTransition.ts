import { lerp, Vector } from "kontra";

export class SceneTransition {
  private targetY = -10;
  private lerpFactor = 0.09;
  private pos = Vector(0, 0);
  private state: "fadein" | "fadeout" | "comeplete" = "fadein";
  constructor(private canvas: HTMLCanvasElement) {
    this.pos.y = canvas.height;
  }

  getState() {
    return this.state;
  }

  update() {
    if (this.pos.y - 1 >= this.targetY) {
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
    context.clearRect(0, 0, width, height);

    // Draw the black box
    context.fillStyle = "black";
    context.fillRect(0, this.pos.y, width, height);
  }

  isFadeInComplete() {
    return this.pos.y <= this.targetY;
  }
  isFadeOutComplete() {
    return this.pos.y <= this.targetY - this.canvas.height;
  }
  reset() {
    this.state = "fadein";
    this.pos.y = this.canvas.height;
  }
}
