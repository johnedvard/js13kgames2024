import { Vector } from "kontra";

// ⇧ ⇨ ⇩ ⇦
export default function getLevel() {
  return {
    playerPos: Vector(-200, -150),
    goalPos: Vector(1850, -25),
    objects: [
      // 1 moving platform
      {
        box: {
          pos: Vector(-200, 50),
          width: 500,
          height: 100,
          options: {
            path: { x: 500, y: 0 },
            speed: { x: 1.5, y: 0 },
            direction: -1,
          },
        },
      },
      // second moving platform (above)
      {
        box: {
          pos: Vector(600, -600),
          width: 500,
          height: 100,
          options: {
            path: { x: 500, y: 0 },
            speed: { x: 1.5, y: 0 },
            direction: 1,
          },
        },
      },
      // third moving platform
      {
        box: {
          pos: Vector(1500, 50),
          width: 500,
          height: 100,
          options: {
            path: { x: 500, y: 0 },
            speed: { x: 1.5, y: 0 },
            direction: -1,
          },
        },
      },
    ],
  };
}
