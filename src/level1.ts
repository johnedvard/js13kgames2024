import { Vector } from "kontra";
import { GAME_HEIGHT, GAME_WIDTH } from "./main";
import { bottomWall, topWall } from "./levelUtils";

export default function getLevel() {
  return {
    playerPos: Vector(GAME_WIDTH / 2, GAME_HEIGHT / 2),
    goalPos: Vector(GAME_WIDTH / 2 + 150, GAME_HEIGHT - 80),
    objects: [
      {
        box: {
          pos: Vector(GAME_WIDTH / 2 - 250, 0),
          width: 50,
          height: GAME_HEIGHT,
        },
      },
      {
        box: {
          pos: Vector(GAME_WIDTH / 2 + 250, 0),
          width: 50,
          height: GAME_HEIGHT,
        },
      },
      bottomWall(),
      topWall(),
    ],
  };
}
