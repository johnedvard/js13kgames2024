import { Vector } from "kontra";

// ⇧ ⇨ ⇩ ⇦
export default function getLevel() {
  return {
    playerPos: Vector(0, 0),
    goalPos: Vector(1200, -400),
    objects: [
      // floor
      { box: { pos: Vector(-500, 160), width: 2000, height: 200 } },
      // right wall
      { box: { pos: Vector(1500, -1000), width: 200, height: 2800 } },
      { text: { pos: Vector(100, 200), text: "Attach to floor ⇨ " } },
      { text: { pos: Vector(1000, 200), text: "Hold to go ⇧ " } },
    ],
  };
}
