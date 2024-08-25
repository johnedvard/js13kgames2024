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
          text: "Some bubbles are friendly",
        },
      },
      { enemy: { pos: Vector(500, -20), options: { balloonType: "friend" } } },
      { enemy: { pos: Vector(860, -50), options: { balloonType: "friend" } } },
    ],
  };
}
