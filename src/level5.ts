import { Vector } from "kontra";
const h = 1800;
const w = 2500;

export default function getLevel() {
  return {
    playerPos: Vector(150, h - 350),
    goalPos: Vector(250, 400),
    objects: [
      // larger box bottom
      { box: { pos: Vector(900, h - 350), width: 350, height: 350 } },
      // larger box above bottom
      // h - 950 is hard, but can be done.  h - 1050 is easier
      {
        box: { pos: Vector(900, h - 950), width: 350, height: 350 },
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
      {
        // left wall
        box: {
          pos: Vector(-100, -100),
          width: 150,
          height: 750,
        },
      },
      { text: { pos: Vector(w + 20, 200), text: "Up ⇧" } },
      { text: { pos: Vector(w + 20, h - 200), text: "Up ⇧" } },
      { text: { pos: Vector(w + 20, h - 800), text: "Up ⇧" } },
      { text: { pos: Vector(w - 400, -50), text: "⇦ Left" } },
      // right wall
      {
        box: {
          pos: Vector(w, -100),
          width: 150,
          height: h + 200,
        },
      },

      // top wall (roof)
      {
        box: { pos: Vector(-100, -100), width: w + 250, height: 100 },
      },
      // bottom wall
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
