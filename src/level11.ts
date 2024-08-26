import { Vector } from "kontra";

const h = 1800;
const w = 2500;
let boxHeight = 200;

export default function getLevel() {
  return {
    playerPos: Vector(150, h - 350),
    goalPos: Vector(w / 2 + 1150, h - 80),
    objects: [
      // first stair case
      {
        box: {
          pos: Vector(500 + boxHeight, h - boxHeight),
          width: boxHeight,
          height: boxHeight,
        },
      },
      // second stair case
      {
        box: {
          pos: Vector(500 + boxHeight * 2, h - boxHeight * 2),
          width: boxHeight,
          height: boxHeight * 2,
        },
      },
      {
        box: {
          pos: Vector(500 + boxHeight * 3, h - boxHeight * 3),
          width: boxHeight,
          height: boxHeight * 3,
        },
      },
      {
        box: {
          pos: Vector(500 + boxHeight * 4, h - boxHeight * 4),
          width: boxHeight,
          height: boxHeight * 4,
        },
      },
      // floor
      {
        box: {
          pos: Vector(-100, h),
          width: w + 900,
          height: 100,
        },
      },
    ],
  };
}
