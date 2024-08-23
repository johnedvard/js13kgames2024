import { Text, Vector, emit, on, off } from "kontra";
import { isPointInsideCircle, smoothstep } from "./mathUtils";
import { getColorBasedOnGasAmount } from "./colorUtils";
import { GameEvent } from "./GameEvent";
import { Balloon } from "./Balloon";

export class BubbleButton {
  private circlePos = Vector(0, 0);
  private circleRadius = 0;
  private text: Text;
  private smallCircles: any[] = [];
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
    fontSize: number = 40,
    private gameEvent: GameEvent,
    private gameEventArgs: any
  ) {
    this.circlePos = Vector(x, y);
    this.baseRadius = radius;
    this.baseY = y;
    on(GameEvent.up, this.onUp);
    this.text = Text({
      text,
      font: `${fontSize}px Arial`,
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
      emit(this.gameEvent, this.gameEventArgs);
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
      circle.externalForce.x = 2 * (Math.random() - 0.5);
      circle.externalForce.y -= 0.02;
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
    this.smallCircles = this.smallCircles.filter((circle) => {
      return circle.centerPoint.y > -2000;
    });
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

    this.smallCircles.forEach((circle) => circle.render(context));
  }

  private spawnSmallCircles() {
    for (let i = 0; i < 10; i++) {
      const angleY = Math.random() * Math.PI * 2;
      const angleX = Math.random() * Math.PI;
      const pos = Vector(
        this.circlePos.x + Math.cos(angleX) * this.circleRadius,
        this.circlePos.y + Math.sin(angleY) * this.circleRadius
      );
      const smallCircle = new Balloon(this.canvas, pos, {
        gasAmount: 5000,
        length: 1,
        numParticles: 10,
        stiffness: 0.2,
        lineWidth: 2,
        hideParticles: true,
        hideText: true,
        isStationairy: true,
      });
      this.smallCircles.push(smallCircle);
    }
  }
}
