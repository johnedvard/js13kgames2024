import { Vector } from "kontra";
import { Balloon } from "./Balloon";
import { isPointInsideCircle } from "./mathUtils";

export class Goal {
  private alpha: number = 0;
  private fadeDirection: number = 1; // 1 for fading in, -1 for fading out
  private fadeSpeed: number = 0.01; // Adjust this value to control the speed of the fade
  private radius = 70;
  constructor(private pos: Vector) {}

  update() {
    // Update the alpha value for the fade effect
    this.alpha += this.fadeDirection * this.fadeSpeed;

    // Reverse the fade direction if alpha goes out of bounds
    if (this.alpha >= 0.8) {
      this.alpha = 0.8;
      this.fadeDirection = -1;
    } else if (this.alpha <= 0.1) {
      this.alpha = 0.1;
      this.fadeDirection = 1;
    }
  }

  render(context: CanvasRenderingContext2D) {
    context.save();
    context.globalAlpha = this.alpha;
    context.fillStyle = "white";
    context.beginPath();
    context.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
    context.fill();
    context.restore();
  }

  checkIfGoalReached(player: Balloon) {
    if (isPointInsideCircle(player.centerPoint, this.pos, this.radius)) {
      return true;
    }
  }
}
