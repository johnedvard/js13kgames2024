import { Vector } from "kontra";

// ⇧ ⇨ ⇩ ⇦
export default function getLevel() {
  return {
    playerPos: Vector(0, 0),
    goalPos: Vector(1550, 80),
    objects: [
      // floor
      { box: { pos: Vector(-500, 160), width: 2800, height: 200 } },
      {
        text: {
          pos: Vector(100, 200),
          text: "Stick to others, some are friendly",
        },
      },
      { enemy: { pos: Vector(500, -20) } },
      { enemy: { pos: Vector(860, -50) } },
    ],
  };
}
