import { GameObject, Text, Vector } from "kontra";
import { isPointInsideCircle, smoothstep } from "./mathUtils";
import { getColorBasedOnGasAmount } from "./colorUtils";
import { GameEvent } from "./GameEvent";
import { emit, on, off } from "./eventEmitter";

export class BubbleButton {
  private circlePos = Vector(0, 0);
  private circleRadius = 0;
  private text: Text;
  private smallCircles: GameObject[] = [];
  private baseY: number;
  private baseRadius = 0;
  private time: number = 0;
  private timeRadius: number = 0;
  private duration: number = 2000; // Duration for one full float cycle in ms
  private direction = 1;
  private directionRadius = 1;
  private lineDashLength = 100;
  private lineDashGap = 50;
  isClicked = false;

  constructor(
    private canvas: HTMLCanvasElement,
    x: number,
    y: number,
    radius: number,
    text: string,
    private gameEvent: GameEvent
  ) {
    this.baseRadius = radius;
    this.baseY = y;
    console.log("listen to up");
    on(GameEvent.up, this.onUp);
    this.text = Text({
      text,
      font: "40px Arial",
      color: getColorBasedOnGasAmount(0),
      x: x,
      y: y,
      context: this.canvas.getContext("2d") as CanvasRenderingContext2D,
      anchor: { x: 0.5, y: 0.5 },
    });
  }

  onUp = (pos: Vector) => {
    if (this.isClicked) return;
    const transform = this.canvas.getContext("2d")?.getTransform();
    if (!transform) return;
    if (
      isPointInsideCircle(
        Vector(pos.x, pos.y),
        this.circlePos.add(Vector(transform.e, transform.f)),
        this.circleRadius
      )
    ) {
      this.isClicked = true;
      off(GameEvent.up, this.onUp);
      emit(this.gameEvent);
      this.spawnSmallCircles();
    }
  };

  update() {
    this.time += 10 * this.direction;
    this.timeRadius += 5 * this.directionRadius;
    const tY = (this.time % this.duration) / this.duration;
    const tRadius = (this.timeRadius % this.duration) / this.duration;
    // Change direction when reaching the top or bottom
    if (tY >= 0.98 || tY <= 0) {
      this.direction *= -1;
    }
    if (tRadius >= 0.98 || tRadius <= 0) {
      this.directionRadius *= -1;
    }
    const easedY = smoothstep(tY);
    const easedR = smoothstep(tRadius);
    this.circlePos.y = this.baseY + (easedY * 10 - 3); // Float up and down
    this.circleRadius = this.baseRadius + (easedR * 10 - 3); // Pulse

    this.text.y = this.circlePos.y;
    // Update small circles
    this.smallCircles.forEach((circle) => {
      circle.update();
      circle.y -= 1; // Apply upward gravity
      circle.x += Math.sin(circle.y / 10); // Sway left and right
    });

    if (this.isClicked) {
      this.lineDashLength -= 2;
      if (this.lineDashLength <= 1) {
        this.lineDashLength = 1;
      }
      this.lineDashGap += 5;
      this.baseRadius = this.baseRadius * 1.01 + 4;
    }
    // Remove small circles that are out of bounds
    this.smallCircles = this.smallCircles.filter(
      (circle) => circle.y + circle.radius + 20000 > 0
    );
  }

  render(context: CanvasRenderingContext2D) {
    if (this.baseRadius <= 500) {
      context.save(); // Save the current state of the context

      context.beginPath();
      context.arc(
        this.circlePos.x,
        this.circlePos.y,
        this.circleRadius,
        0,
        Math.PI * 2
      );
      if (this.isClicked) {
        context.setLineDash([this.lineDashLength, this.lineDashGap]); // 5px dash, 3px gap
      }
      context.strokeStyle = getColorBasedOnGasAmount(0);
      context.lineWidth = 5;
      context.stroke();
      context.setLineDash([]);
      context.restore(); // Restore the state of the context
    }
    if (!this.isClicked) {
      this.text.render();
    }

    // Render small circles
    this.smallCircles.forEach((circle) => circle.render());
  }

  private spawnSmallCircles() {
    for (let i = 0; i < 10; i++) {
      const angleY = Math.random() * Math.PI * 2;
      const angleX = Math.random() * Math.PI;
      const speedY = Math.random() * 2 + 1;
      const speedX = Math.random();
      const smallCircle = GameObject({
        context: this.canvas.getContext("2d") as CanvasRenderingContext2D,
        x: this.circlePos.x + (Math.cos(angleX) * this.circleRadius) / 3,
        y: this.circlePos.y + (Math.sin(angleY) * this.circleRadius) / 3,
        radius: 9,
        dx: Math.cos(angleX) * speedX,
        dy: Math.sin(angleY) * speedY,
        update: function () {
          this.advance();
          if (!this.dy) return;
          this.dy -= 0.05; // Apply upward force
        },
        render: function () {
          const context = this.context;
          if (!context) return;
          context.save();
          context.beginPath();
          context.arc(
            this.x || 0,
            this.y || 0,
            this.radius || 0,
            0,
            Math.PI * 2
          );
          context.fillStyle = getColorBasedOnGasAmount(50000);
          context.fill();
          context.restore();
        },
      });
      this.smallCircles.push(smallCircle);
    }
  }
}
