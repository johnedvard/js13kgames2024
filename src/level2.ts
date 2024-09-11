import { Vector } from "kontra";

// ⇧ ⇨ ⇩ ⇦
export default function getLevel() {
  return {
    playerPos: Vector(500, 0),
    goalPos: Vector(1200, -400),
    objects: [
      // floor
      { box: { pos: Vector(-500, 160), width: 2000, height: 200 } },
      // right wall
      { box: { pos: Vector(1500, -1000), width: 300, height: 2800 } },
      { text: { pos: Vector(600, 200), text: "⇨ Stick to floor to go ⇨" } },
      { text: { pos: Vector(1550, 0), text: "Keep holding" } },
      { text: { pos: Vector(1200, 200), text: "Hold to go ⇧" } },
    ],
  };
}
