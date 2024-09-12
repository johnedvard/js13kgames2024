import { Vector } from "kontra";
import { Balloon } from "./Balloon";

export function addBubbleParticles(canvas: HTMLCanvasElement, pos: Vector) {
  const particle = new Balloon(canvas, pos, {
    gasAmount: 500,
    length: 1,
    distance: 2,
    numParticles: 5,
    stiffness: 0.1,
    lineWidth: 4,
    hideParticles: true,
    hideText: true,
    isStationairy: true,
    balloonType: "d",
    timeToLive: 1000 + Math.random() * 2000,
  });
  particle.externalForce.x = (Math.random() - 0.3) / 8;
  particle.externalForce.y -= 0.17;
  return particle;
}
