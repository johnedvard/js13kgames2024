import { Vector } from "kontra";

export default function getLevel() {
  return {
    playerPos: Vector(0, 0),
    goalPos: Vector(0, 500),
    objects: [],
  };
}
