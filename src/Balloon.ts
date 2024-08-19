import { emit, Text, Vector } from "kontra";
import { Particle } from "./Particle";
import { Spring } from "./Spring";
import { catmullRomSpline } from "./mathUtils";
import { isUserTouching } from "./inputController";
import { GameEvent } from "./GameEvent";

const MING_GAS_AMOUNT = 10000;

type BalloonOptions = {
  numParticles: number;
  length: number;
  stiffness: number;
  gasAmount: number;
};
export class Balloon {
  state: "" | "dead" = "";
  springs: Spring[] = [];
  particles: Particle[] = []; // Store particles for collision detection
  volume: number = 0; // calculated volume i the balloon
  gasPressure: number = 0; // calculated gas pressure in the balloon
  centerPoint: Vector = Vector(0, 0); // Center point of the balloon
  balloonGravity: Vector = Vector(0, 0); // calculated Gravity acting on the preassure in the balloon

  text: Text;

  gasAmount: number = 70000; // Number of moles of gas
  R: number = 0.3; // Ideal gas constant
  T: number = 3; // Temperature in Kelvin

  constructor(
    canvas: HTMLCanvasElement,
    startPos: Vector,
    ballonOptions?: BalloonOptions
  ) {
    this.text = Text({
      text: "",
      font: "32px Arial",
      color: "white",
      x: 300,
      y: 100,
      anchor: { x: 0.7, y: 0.2 },
      context: canvas.getContext("2d") as CanvasRenderingContext2D,
    });

    this.gasAmount = ballonOptions?.gasAmount || 70000;
    const numParticles = ballonOptions?.numParticles || 20;
    const distance = ballonOptions?.length ? ballonOptions?.length * 5 : 50;
    const length = ballonOptions?.length || 10;
    const stiffness = ballonOptions?.stiffness || 0.09;
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
      this.particles.forEach((particle) => {
        particle.applyForce(this.balloonGravity);
        particle.update();
      });
    } else {
      this.springs.forEach((spring) => spring.update());
      this.particles.forEach((particle) => {
        particle.applyForce(this.balloonGravity);
      });
    }
    this.centerPoint = this.particles
      .reduce((acc, particle) => acc.add(particle.pos), Vector(0, 0))
      .scale(1 / this.particles.length);

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
    if (this.state === "dead") return;
    const gasToAdd = 500;
    if (isUserTouching()) {
      this.gasAmount += gasToAdd;
    } else {
      this.gasAmount -= gasToAdd / 2;
    }
    if (this.gasAmount < MING_GAS_AMOUNT) {
      this.gasAmount = MING_GAS_AMOUNT;
    }
    if (this.gasAmount > 130999) {
      this.setState("dead");
      emit(GameEvent.burstBalloon);
    }
  }

  setState(state: "" | "dead") {
    this.state = state;
    switch (state) {
      case "dead":
        this.springs.length = 0;
        break;
    }
  }

  render(context: CanvasRenderingContext2D) {
    if (this.state === "dead") {
      this.particles.forEach((particle) => {
        particle.render(context);
      });
      return;
    }
    this.springs.forEach((spring) => spring.render(context));

    this.renderOutline(context);

    this.renderGasAmount({
      x: this.centerPoint.x + 10,
      y: this.centerPoint.y - 10,
    });
  }

  renderGasAmount(position: { x: number; y: number }) {
    const maxGasAmount = 130000;
    const gasValue = (this.gasAmount / maxGasAmount) * 13;
    const gasValueRounded = gasValue.toFixed(1);

    this.text.text = gasValueRounded;
    this.text.color = this.getColorBasedOnGasAmount(this.gasAmount);
    this.text.x = position.x;
    this.text.y = position.y;
    this.text.render();
  }
  renderOutline(context: CanvasRenderingContext2D) {
    // Create a spline through all the points in the particles array
    context.beginPath();
    context.moveTo(this.particles[0].pos.x, this.particles[0].pos.y);
    context.strokeStyle = this.getColorBasedOnGasAmount(this.gasAmount);
    context.lineWidth = 10;
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

  getColorBasedOnGasAmount(gasAmount: number): string {
    const maxGasAmount = 130000;
    const threshold = 20000;

    // Ensure gasAmount is within the range
    gasAmount = Math.max(0, Math.min(gasAmount, maxGasAmount));

    // If gasAmount is less than the threshold, return green
    if (gasAmount < threshold) {
      return "rgb(0, 255, 0)"; // Green
    }

    // Define start (green) and end (red) colors in RGB
    const startColor = { r: 0, g: 255, b: 0 }; // Green
    const endColor = { r: 255, g: 0, b: 0 }; // Red

    // Calculate the interpolation factor
    const factor = (gasAmount - threshold) / (maxGasAmount - threshold);

    // Interpolate between the start and end colors
    const r = Math.round(startColor.r + factor * (endColor.r - startColor.r));
    const g = Math.round(startColor.g + factor * (endColor.g - startColor.g));
    const b = Math.round(startColor.b + factor * (endColor.b - startColor.b));

    // Return the color as a CSS-compatible string
    return `rgb(${r}, ${g}, ${b})`;
  }
}
