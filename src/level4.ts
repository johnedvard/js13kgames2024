import { Vector } from "kontra";
import { GAME_HEIGHT, GAME_WIDTH } from "./main";
import { bottomWall, topWall } from "./levelUtils";

export default function getLevel() {
  return {
    playerPos: Vector(150, GAME_HEIGHT - 350),
    goalPos: Vector(250, 400),
    objects: [
      // larger box bottom
      { box: { pos: Vector(900, GAME_HEIGHT - 350), width: 350, height: 350 } },
      // larger box above bottom
      // GAME_HEIGHT - 950 is hard, but can be done.  GAME_HEIGHT - 1050 is easier
      {
        box: { pos: Vector(900, GAME_HEIGHT - 1000), width: 350, height: 350 },
      },
      // middle floor
      {
        box: {
          pos: Vector(-100, GAME_HEIGHT - 1150),
          width: GAME_WIDTH - 400,
          height: 200,
        },
      },

      // box on left, small
      {
        box: {
          pos: Vector(700, GAME_HEIGHT - 150),
          width: 150,
          height: 150,
        },
      },
      {
        // left wall
        box: {
          pos: Vector(-100, -100),
          width: 150,
          height: GAME_HEIGHT / 2,
        },
      },
      // right wall
      {
        box: {
          pos: Vector(GAME_WIDTH, -100),
          width: 150,
          height: GAME_HEIGHT + 200,
        },
      },

      topWall(),
      bottomWall(),
    ],
  };
}
