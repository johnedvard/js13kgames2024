import { Vector } from "kontra";

// ⇧ ⇨ ⇩ ⇦
export default function getLevel() {
  return {
    playerPos: Vector(0, 0),
    goalPos: Vector(2550, 80),
    objects: [
      // 1 floor
      { box: { pos: Vector(-500, 160), width: 1500, height: 100 } },
      // moving platform between first and second floor
      {
        box: {
          pos: Vector(1000, -200),
          width: 500,
          height: 100,
          options: {
            path: { x: 500, y: 0 },
            speed: { x: 1.5, y: 0 },
            direction: -1,
          },
        },
      },
      // 2 floor
      { box: { pos: Vector(1700, 160), width: 1500, height: 100 } },
    ],
  };
}
