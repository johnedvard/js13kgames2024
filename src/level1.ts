import { Vector } from "kontra";

// ⇧ ⇨ ⇩ ⇦
export default function getLevel() {
  return {
    playerPos: Vector(0, 0),
    goalPos: Vector(1550, 80),
    objects: [
      // floor
      { box: { pos: Vector(-500, 160), width: 2800, height: 200 } },
      { text: { pos: Vector(100, 200), text: "Attach to floor ⇨" } },
      { text: { pos: Vector(1500, 200), text: "Goal" } },
    ],
  };
}
