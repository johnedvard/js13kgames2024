import { Vector } from "kontra";
import { createBox } from "./shapeFactory";
import { Balloon } from "./Balloon";
import { Camera } from "./Camera";
import { LevelObject } from "./types";
import level1 from "./level1";
import level2 from "./level2";
import level3 from "./level3";
import { Goal } from "./Goal";
import { GAME_HEIGHT, GAME_WIDTH } from "./main";

const levels: Array<() => LevelObject> = [level1, level2, level3];

export function topWall() {
  return {
    box: { pos: Vector(-100, -100), width: GAME_WIDTH + 200, height: 100 },
  };
}

export function bottomWall() {
  return {
    box: {
      pos: Vector(-100, GAME_HEIGHT),
      width: GAME_WIDTH + 200,
      height: 100,
    },
  };
}

export function initLevel(camera: Camera, levelId = 1) {
  const gameObjects: any[] = [];

  const level = levels[levelId - 1]();
  const player = new Balloon(level.playerPos);
  const goal = new Goal(level.goalPos);
  camera.setPosition(player.centerPoint);

  level.objects.forEach((object: any) => {
    if (object.box) {
      gameObjects.push(
        createBox(object.box.pos, object.box.width, object.box.height)
      );
    }
  });

  return { player, goal, gameObjects };
}
