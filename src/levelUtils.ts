import { Text, Vector } from "kontra";
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
import level7 from "./level7";
import level8 from "./level8";
import level9 from "./level9";
import level10 from "./level10";
import level11 from "./level11";
import level12 from "./level12";
import level13 from "./level13";
import level14 from "./level14";
import { Goal } from "./Goal";
import { getItem } from "./storageUtils";
import { BubbleButton } from "./BubbleButton";
import { GameEvent } from "./GameEvent";
import { getColorBasedOnGasAmount } from "./colorUtils";
import { Spike } from "./Spike";

// Keep an odd number of levels to make it work.
export const levels: Array<() => LevelObject> = [
  level1,
  level2,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
  level9,
  level10,
  level11,
  level12,
  level13, // level 13 is special, it's not a playable level
  level14,
  level14,
];

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
        createBox(
          object.box.pos,
          object.box.width,
          object.box.height,
          object.box?.options
        )
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
    } else if (object.enemy) {
      gameObjects.push(
        new Balloon(canvas, Vector(object.enemy.pos), {
          stiffness: 0.08, // the lighter, the less likely to entagle. 0.05 is light, can move around
          isStationairy: true,
          hideText: true,
          hideParticles: true,
          ...object.enemy.options,
        })
      );
    } else if (object.spike) {
      gameObjects.push(
        new Spike(Vector(object.spike.pos), object.spike.options)
      );
    }
  });

  return { player, goal, gameObjects };
}

export function createLevelSelectObjects(canvas: HTMLCanvasElement) {
  const selectLevelObjects: any[] = [];
  const gap = 150;
  const buttonWidth = 75;
  const startPosX = -400;
  const startPosY = -400;
  for (let col = 1; col <= levels.length / 2; col++) {
    for (let row = 1; row <= 2; row++) {
      const x = startPosX + col * (buttonWidth + gap);
      const y = startPosY + row * (buttonWidth + gap);
      let levelId = col * 2;
      if (row === 1) levelId -= 1;
      if (levelId >= 13) levelId += 1;
      let buttonText = `Level ${levelId}`;
      const isLevelComplete = getItem(`complete-${levelId}`);
      if (isLevelComplete) {
        if (levelId < 10) buttonText += "\n    ✔";
        if (levelId >= 10) buttonText += "\n     ✔"; // center align the checkmark by adding an extra space
      }
      const levelButton = new BubbleButton(
        canvas,
        x,
        y,
        buttonWidth,
        buttonText,
        30,
        GameEvent.play,
        { levelId }
      );

      selectLevelObjects.push(levelButton);
    }
  }

  const text = Text({
    text: "Drag screen to see more levels",
    font: "32px Arial",
    color: getColorBasedOnGasAmount(1000),
    x: 0,
    y: 300,
    anchor: { x: 0.5, y: 0.5 },
    context: canvas.getContext("2d") as CanvasRenderingContext2D,
  }); // TODO add text to button
  selectLevelObjects.push(text);
  return selectLevelObjects;
}
