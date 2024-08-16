import { Vector } from "kontra";
import { Particle } from "./Particle";
import { Spring } from "./Spring";
import { catmullRomSpline } from "./utils";

export class Balloon {
  springs: Spring[] = [];
  particles: Particle[] = []; // Store particles for collision detection
  volume: number = 0; // calculated volume i the balloon
  gasPressure: number = 0; // calculated gas pressure in the balloon

  gasAmount: number = 2000; // Number of moles of gas
  R: number = 0.1; // Ideal gas constant
  T: number = 10; // Temperature in Kelvin

  constructor(startPos: Vector) {
    const numParticles = 6;
    const distance = 20;
    const length = 10;
    const stiffness = 0.1;
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

  update() {
    this.springs.forEach((spring) => spring.update());

    // Update the volume and gas pressure of the balloon
    this.gasPressure = this.calculateGasPressure();

    // Apply force according to gas pressure in the balloon
    const center = this.particles
      .reduce((acc, particle) => acc.add(particle.pos), Vector(0, 0))
      .scale(1 / this.particles.length);
    this.particles.forEach((particle) => {
      const direction = particle.pos.subtract(center).normalize();
      const force = direction.scale(this.gasPressure);
      particle.applyForce(force);
    });

    // Collision detection and resolution
    const radius = 5;
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

  render(context: CanvasRenderingContext2D) {
    this.springs.forEach((spring) => spring.render(context));

    // Create a spline through all the points in the particles array
    context.beginPath();
    context.moveTo(this.particles[0].pos.x, this.particles[0].pos.y);
    context.strokeStyle = "#abc";
    context.lineWidth = 3;
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

    context.stroke();
  }
}
