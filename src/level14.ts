import { Vector } from "kontra";

const h = 1800;
const w = 2500;

export default function getLevel() {
  return {
    playerPos: Vector(150, h - 350),
    goalPos: Vector(w / 2 + 550, h - 80),
    objects: [
      // larger box bottom
      { box: { pos: Vector(1900, h - 350), width: 350, height: 350 } },
      { text: { pos: Vector(710, h - 50), text: "Hold to go ⇧" } },
      // box on left, small
      {
        box: {
          pos: Vector(700, h - 150),
          width: 200,
          height: 150,
        },
      },
      // friend on top of small box
      {
        enemy: {
          pos: Vector(1000, h - 300),
          options: { balloonType: "f" },
        },
      },
      // spike behind small box
      { spike: { pos: Vector(800 + 225, h - 150) } },
      { spike: { pos: Vector(800 + 300, h - 150) } },
      // floor
      {
        box: {
          pos: Vector(-100, h),
          width: w + 200,
          height: 100,
        },
      },
    ],
  };
}
