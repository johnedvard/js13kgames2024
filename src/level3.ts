import { Vector } from "kontra";
import { GAME_HEIGHT, GAME_WIDTH } from "./main";
import { bottomWall, topWall } from "./levelUtils";

export default function getLevel() {
  return {
    playerPos: Vector(150, GAME_HEIGHT - 350),
    goalPos: Vector(GAME_WIDTH / 2 + 550, GAME_HEIGHT - 80),
    objects: [
      { box: { pos: Vector(900, GAME_HEIGHT - 350), width: 350, height: 350 } },
      {
        box: {
          pos: Vector(-100, GAME_HEIGHT - 1150),
          width: GAME_WIDTH + 200,
          height: 200,
        },
      },
      {
        box: {
          pos: Vector(700, GAME_HEIGHT - 150),
          width: 150,
          height: 150,
        },
      },
      topWall(),
      bottomWall(),
    ],
  };
}
