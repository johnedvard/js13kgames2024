import { Vector } from "kontra";

// ⇧ ⇨ ⇩ ⇦
export default function getLevel() {
  return {
    playerPos: Vector(200, 0),
    goalPos: Vector(1200, -400),
    objects: [
      // floor
      { box: { pos: Vector(-500, 160), width: 2000, height: 200 } },
      // right wall
      { box: { pos: Vector(1500, -1000), width: 200, height: 2800 } },
      { enemy: { pos: Vector(1200, -20) } },
      { enemy: { pos: Vector(860, -50) } },
      {
        text: {
          pos: Vector(200, 200),
          text: "Not all bubbles are friendly",
        },
      },
      { text: { pos: Vector(200, 250), text: "Use friends to take foes" } },
    ],
  };
}
