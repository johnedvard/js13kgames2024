import { Vector, Text } from "kontra";
import { createBox } from "./shapeFactory";
import { Balloon } from "./Balloon";
import { Camera } from "./Camera";
import { LevelObject } from "./types";
import level1 from "./level1";
import level2 from "./level2";
import level3 from "./level3";
import level4 from "./level4";
import level5 from "./level5";
import level6 from "./level6";
import { Goal } from "./Goal";
import { GAME_HEIGHT, GAME_WIDTH } from "./main";

export const levels: Array<() => LevelObject> = [
  level1,
  level2,
  level3,
  level4,
  level5,
  level6,
];

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

export function initLevel(
  canvas: HTMLCanvasElement,
  camera: Camera,
  levelId = 1
) {
  const gameObjects: any[] = [];

  const level = levels[levelId - 1]();
  const player = new Balloon(canvas, level.playerPos);
  const goal = new Goal(level.goalPos);
  camera.setPosition(player.centerPoint);

  level.objects.forEach((object: any) => {
    if (object.box) {
      gameObjects.push(
        createBox(object.box.pos, object.box.width, object.box.height)
      );
    } else if (object.text) {
      const text = Text({
        x: object.text.pos.x,
        y: object.text.pos.y,
        text: object.text.text,
        font: "32px Arial",
        context: canvas.getContext("2d") as CanvasRenderingContext2D,
      });
      gameObjects.push(text);
    }
  });

  return { player, goal, gameObjects };
}
