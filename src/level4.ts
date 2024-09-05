import { Vector } from "kontra";

const GAME_HEIGHT = 500;
export default function getLevel() {
  return {
    playerPos: Vector(150, GAME_HEIGHT - 220),
    goalPos: Vector(4500 + 150, GAME_HEIGHT + 320),
    objects: [
      // first ramp
      { text: { pos: Vector(400, GAME_HEIGHT + 25), text: "⇨" } },
      {
        box: {
          pos: Vector(-100, GAME_HEIGHT),
          width: 1500,
          height: 100,
        },
      },
      { text: { pos: Vector(1200, GAME_HEIGHT + 25), text: "Falling is OK" } },
      // second ramp
      {
        box: {
          pos: Vector(1500 + 250, GAME_HEIGHT + 200),
          width: 1500,
          height: 100,
        },
      },
      {
        text: { pos: Vector(2700, GAME_HEIGHT + 225), text: "Don't be afraid" },
      },
      // third ramp
      {
        box: {
          pos: Vector(3000 + 540, GAME_HEIGHT + 400),
          width: 1800,
          height: 100,
        },
      },
    ],
  };
}
