import { Vector } from "kontra";

// ⇧ ⇨ ⇩ ⇦
export default function getLevel() {
  return {
    playerPos: Vector(200, -200),
    goalPos: Vector(2550, 2550),
    objects: [
      // 1 floor
      { box: { pos: Vector(-500, 0), width: 1500, height: 100 } },

      // left wall
      { box: { pos: Vector(-500, -900), width: 100, height: 1000 } },
      // right wall
      { box: { pos: Vector(1000, -900), width: 100, height: 1000 } },
      // ceilig
      { box: { pos: Vector(-500, -900), width: 1500, height: 100 } },
      { text: { pos: Vector(250, 50), text: "Thank you for playing!" } },
      // box in the middle
      { box: { pos: Vector(350, -450), width: 100, height: 100 } },
    ],
  };
}
