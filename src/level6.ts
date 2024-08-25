import { Vector } from "kontra";

const h = 1800;
const w = 2500;
export default function getLevel() {
  return {
    playerPos: Vector(150, h - 350),
    goalPos: Vector(1650, 1000),
    objects: [
      // larger box bottom
      { box: { pos: Vector(1900, h - 350), width: 350, height: 350 } },
      // larger box above bottom
      // h - 950 is hard, but can be done.  h - 1050 is easier
      {
        box: { pos: Vector(1900, h - 950), width: 350, height: 350 },
      },
      // middle floor
      {
        box: {
          pos: Vector(-100, h - 1150),
          width: w - 500,
          height: 200,
        },
      },

      // box on left, small
      {
        box: {
          pos: Vector(700, h - 150),
          width: 200,
          height: 150,
        },
      },
      //second box on left, small
      {
        box: {
          pos: Vector(1700, h - 150),
          width: 200,
          height: 150,
        },
      },
      // floor
      {
        box: {
          pos: Vector(-100, h),
          width: w + 100,
          height: 100,
        },
      },
    ],
  };
}
