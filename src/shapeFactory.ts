import { Vector } from "kontra";
import { RigidBody, RigidBodyOptions } from "./RigidBody";

export function createBox(
  pos: Vector,
  width: number,
  height: number,
  options?: RigidBodyOptions
): RigidBody {
  const particlePos = [
    Vector(pos),
    Vector(pos.x + width, pos.y),
    Vector(pos.x + width, pos.y + height),
    Vector(pos.x, pos.y + height),
  ];
  return new RigidBody(particlePos, options);
}
