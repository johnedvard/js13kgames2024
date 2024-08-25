import { Vector } from "kontra";
import { GAME_HEIGHT } from "./main";

export default function getLevel() {
  return {
    playerPos: Vector(150, GAME_HEIGHT - 220),
    goalPos: Vector(4500 + 150, GAME_HEIGHT + 320),
    objects: [
      // first ramp
      {
        box: {
          pos: Vector(-100, GAME_HEIGHT),
          width: 1500,
          height: 100,
        },
      },
      // second ramp
      {
        box: {
          pos: Vector(1500 + 250, GAME_HEIGHT + 200),
          width: 1500,
          height: 100,
        },
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
