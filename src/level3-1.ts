import { Vector } from "kontra";

// ⇧ ⇨ ⇩ ⇦
export default function getLevel() {
  return {
    playerPos: Vector(500, 0),
    goalPos: Vector(0, -200),
    objects: [
      // floor
      { box: { pos: Vector(-1000, 160), width: 2000, height: 200 } },
      // right wall
      { box: { pos: Vector(1000, -1000), width: 300, height: 2800 } },
      // ceiling
      { box: { pos: Vector(-1000, -400), width: 2000, height: 100 } },
      { text: { pos: Vector(750, 200), text: "Hold to go ⇧" } },
      { text: { pos: Vector(1050, 0), text: "Keep holding" } },
      { text: { pos: Vector(600, -350), text: "⇦ Stick to ceiling to go ⇦" } },
    ],
  };
}
