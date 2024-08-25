import { Text, Vector, emit } from "kontra";
import { Particle } from "./Particle";
import { Spring } from "./Spring";
import { catmullRomSpline, getCenterPoint } from "./mathUtils";
import { isUserTouching } from "./inputController";
import { GameEvent } from "./GameEvent";
import { getColorBasedOnGasAmount } from "./colorUtils";

const MING_GAS_AMOUNT = 10000;

type BalloonType = "friend" | "foe" | "player";
type BalloonOptions = {
  numParticles?: number;
  length?: number;
  stiffness?: number;
  gasAmount?: number;
  isStationairy?: boolean;
  lineWidth?: number;
  hideText?: boolean;
  hideParticles?: boolean;
  balloonType?: BalloonType;
};
export class Balloon {
  state: "" | "dead" = "";
  springs: Spring[] = [];
  particles: Particle[] = []; // Store particles for collision detection
  volume: number = 0; // calculated volume i the balloon
  gasPressure: number = 0; // calculated gas pressure in the balloon
  centerPoint: Vector = Vector(0, 0); // Center point of the balloon
  balloonGravity: Vector = Vector(0, 0); // calculated Gravity acting on the preassure in the balloon
  isStationairy: boolean = false;
  balloonType: BalloonType = "player";
  text!: Text;
  lineWidth = 10;
  hideParticles = false;
  externalForce = Vector(0, 0); // force that can be applied to the balloon from outside
  isBalloon = true;
  hideText = false;
  ellapsedDeadTime = 0;

  gasAmount: number = 70000; // Number of moles of gas
  R: number = 0.3; // Ideal gas constant
  T: number = 3; // Temperature in Kelvin

  constructor(
    canvas: HTMLCanvasElement,
    startPos: Vector,
    ballonOptions?: BalloonOptions
  ) {
    this.hideText = ballonOptions?.hideText || false;

    this.text = Text({
      text: "",
      font: "32px Arial",
      color: "white",
      x: 300,
      y: 100,
      anchor: { x: 0.7, y: 0.2 },
      context: canvas.getContext("2d") as CanvasRenderingContext2D,
    });

    this.gasAmount = ballonOptions?.gasAmount || 65000;
    this.lineWidth = ballonOptions?.lineWidth || 10;
    this.hideParticles = ballonOptions?.hideParticles || false;
    this.balloonType = ballonOptions?.balloonType || "player";
    const numParticles = ballonOptions?.numParticles || 20;
    const distance = ballonOptions?.length ? ballonOptions?.length * 5 : 50;
    const length = ballonOptions?.length || 10;
    const stiffness = ballonOptions?.stiffness || 0.09;
    this.isStationairy = ballonOptions?.isStationairy || false;
    const angleStep = (2 * Math.PI) / numParticles;

    // Create particles around the perimeter
    for (let i = 0; i < numParticles; i++) {
      const angle = i * angleStep;
      const x = startPos.x + distance * Math.cos(angle); // Centered at (50, 50)
      const y = startPos.y + distance * Math.sin(angle);
      this.particles.push(new Particle(Vector(x, y)));
    }

    // Create springs between adjacent particles to form the balloon's perimeter
    for (let i = 0; i < numParticles; i++) {
      const nextIndex = (i + 1) % numParticles;
      const spring = new Spring(
        this.particles[i],
        this.particles[nextIndex],
        length,
        stiffness
      );
      this.springs.push(spring);
    }
  }

  calculateVolume(): number {
    let area = 0;
    const n = this.particles.length;
    for (let i = 0; i < n; i++) {
      const current = this.particles[i].pos;
      const next = this.particles[(i + 1) % n].pos;
      area += current.x * next.y - next.x * current.y;
    }
    return Math.abs(area) / 2;
  }

  calculateGasPressure(): number {
    this.volume = this.calculateVolume();
    return (this.gasAmount * this.R * this.T) / this.volume;
  }
  updateBalloonGravity() {
    const maxGasAmount = 130000;
    const minGravity = -0.1;
    const maxGravity = 0.1;

    // Ensure gasAmount is within the range
    const clampedGasAmount = Math.max(
      500,
      Math.min(this.gasAmount, maxGasAmount)
    );

    // Calculate the interpolation factor
    const factor = clampedGasAmount / maxGasAmount;

    // Interpolate between minGravity and maxGravity
    const gravity = minGravity + factor * (maxGravity - minGravity);

    // Set the balloonGravity
    this.balloonGravity = Vector(0.001, -gravity);
  }

  applyGasPressureForce() {
    const gasPressure = this.calculateGasPressure();
    this.springs.forEach((spring) => {
      const p1 = spring.p1;
      const p2 = spring.p2;
      spring.length = this.gasAmount / 5000;
      if (spring.length < 1) spring.length = 1;
      p1.applyForce(spring.normalVector.scale(gasPressure)); // prent the balloon from spinning
      p2.applyForce(spring.normalVector.scale(gasPressure).scale(-1)); // prent the balloon from spinning
    });
  }

  update() {
    if (this.state === "dead") {
      this.ellapsedDeadTime += 1000 / 60;
      if (this.ellapsedDeadTime <= 2000) {
        this.particles.forEach((particle) => {
          particle.applyForce(this.balloonGravity.add(this.externalForce));
          particle.update();
        });
      }
    } else {
      this.springs.forEach((spring) => spring.update());
      this.particles.forEach((particle) => {
        particle.applyForce(this.balloonGravity.add(this.externalForce));
      });
    }
    this.centerPoint = getCenterPoint(this.particles);

    this.handleGasInput();
    this.updateBalloonGravity();
    this.applyGasPressureForce();

    // Collision detection and resolution
    const radius = 15;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        const distance = p1.pos.distance(p2.pos);
        const minDistance = radius / 2; // Minimum distance to consider a collision

        if (distance < minDistance) {
          const overlap = minDistance - distance;
          const direction = p1.pos.subtract(p2.pos).normalize();
          p1.pos = p1.pos.add(direction.scale(overlap / 2));
          p2.pos = p2.pos.subtract(direction.scale(overlap / 2));
        }
      }
    }
  }

  handleGasInput() {
    if (this.isStationairy) return;
    if (this.state === "dead") return;
    const gasToAdd = 500;
    if (isUserTouching()) {
      this.gasAmount += gasToAdd;
    } else {
      this.gasAmount -= gasToAdd;
    }
    if (this.gasAmount < MING_GAS_AMOUNT) {
      this.gasAmount = MING_GAS_AMOUNT;
    }
    if (this.gasAmount > 130999) {
      this.setState("dead");
    }
  }

  setState(state: "" | "dead") {
    this.state = state;
    switch (state) {
      case "dead":
        emit(GameEvent.burstBalloon, this);
        this.springs.length = 0;
        break;
    }
  }

  render(context: CanvasRenderingContext2D) {
    if (this.state === "dead") {
      return;
    }
    this.springs.forEach((spring) =>
      spring.render(context, this, { hideParticles: this.hideParticles })
    );

    this.renderOutline(context);

    this.renderGasAmount(
      Vector(this.centerPoint.x + 10, this.centerPoint.y - 10)
    );
    this.renderEnemyText(
      Vector(this.centerPoint.x + 10, this.centerPoint.y - 10)
    );
  }

  renderEnemyText(pos: Vector) {
    if (this.balloonType === "foe") {
      this.text.text = "XIII";
      this.text.color = getColorBasedOnGasAmount(130000);
      this.text.x = pos.x;
      this.text.y = pos.y;
      this.text.render();
    }
  }

  renderGasAmount(pos: Vector) {
    if (this.hideText) return;
    const maxGasAmount = 130000;
    const gasValue = (this.gasAmount / maxGasAmount) * 13;
    const gasValueRounded = gasValue.toFixed(1);
    this.text.text = gasValueRounded;
    this.text.color = getColorBasedOnGasAmount(this.gasAmount);
    this.text.x = pos.x;
    this.text.y = pos.y;
    this.text.render();
  }
  renderOutline(context: CanvasRenderingContext2D) {
    // Create a spline through all the points in the particles array
    context.beginPath();
    context.moveTo(this.particles[0].pos.x, this.particles[0].pos.y);
    if (this.balloonType === "foe") {
      context.strokeStyle = getColorBasedOnGasAmount(130000);
    } else if (this.balloonType === "friend") {
      context.strokeStyle = "#1c2";
    } else {
      context.strokeStyle = getColorBasedOnGasAmount(this.gasAmount);
    }
    context.lineWidth = this.lineWidth;
    const vertices = this.particles.map((p) => p.pos);

    // Function to calculate Catmull-Rom spline points
    // Draw the Catmull-Rom spline
    for (let i = 0; i < vertices.length; i++) {
      const p0 = vertices[(i - 1 + vertices.length) % vertices.length];
      const p1 = vertices[i];
      const p2 = vertices[(i + 1) % vertices.length];
      const p3 = vertices[(i + 2) % vertices.length];

      if (i === 0) {
        context.moveTo(p1.x, p1.y);
      }

      for (let t = 0; t < 1; t += 0.1) {
        const pos = catmullRomSpline(p0, p1, p2, p3, t);
        context.lineTo(pos.x, pos.y);
      }
    }

    // Close the path to connect the first and last point
    context.closePath();
    context.stroke();
  }
}
