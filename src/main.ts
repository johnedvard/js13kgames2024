import { init, GameLoop, Vector, Text, on } from "kontra";
// import { initThirdweb } from "./thirdweb";
import { Balloon } from "./Balloon";
import { initializeInputController } from "./inputController";
import { Camera } from "./Camera";
import { initLevel, levels } from "./levelUtils";
import { listenForResize } from "./domUtils";
import { handleCollision } from "./gameUtils";
import { Goal } from "./Goal";
import { SceneTransition } from "./SceneTransition";
import { GameEvent } from "./GameEvent";

import { BubbleButton } from "./BubbleButton";
import { getColorBasedOnGasAmount } from "./colorUtils";
import { getItem, setItem } from "./storageUtils";

const { canvas } = init("game");
const { canvas: transitionCanvas } = init("transition");
const { canvas: hudCanvas } = init("hud");
// These are just in-game values, not the actual canvas size
export const GAME_HEIGHT = 1840;
export const GAME_WIDTH = 2548;

type SceneId = "menu" | "level" | "select";
let activeScene: SceneId = "menu";
let nextScene: SceneId = "level";
const sceneTransition = new SceneTransition(transitionCanvas);
let _objects: any[] = [];
let _player: Balloon;
let _goal: Goal;
let camera: Camera;
let currentLevelId = 1;
let gameHasStarted = false;
let isDisplayingLevelClearScreen = false;
let isDisplayingPlayerDiedScreen = false;
const levelPersistentObjects: any[] = [];
let fadeinComplete = false; // used to control the fadein out transtiion

const mainMenuObjects: any = [];
const selectLevelObjects: any = [];
const playBtn = new BubbleButton(
  canvas,
  0,
  -120,
  75,
  "Play",
  40,
  GameEvent.selectLevel,
  {}
);
// const web3Btn = new BubbleButton(canvas, 0, 120, 75, "Web3", GameEvent.web3);
mainMenuObjects.push(playBtn);

function createLevelSelectButtons() {
  selectLevelObjects.length = 0;

  const gap = 150;
  const buttonWidth = 75;
  console.log("canvas.width", canvas.width);
  const startPosX = -200;
  const startPosY = -200;

  const buttonsPerRow = Math.ceil(levels.length / 2);

  let a = 0; // used to calculate the correct level number
  let b = 1; // used to calculate the correct level number
  levels.forEach((_, index) => {
    if (index > Math.ceil(levels.length / buttonsPerRow)) {
      a = Math.ceil(levels.length / buttonsPerRow);
      b = 2;
    }
    const row = Math.floor(index / buttonsPerRow);
    const col = index % buttonsPerRow;
    const x = startPosX + col * (buttonWidth + gap);
    const y = startPosY + row * (buttonWidth + gap); // Adjust y position for each row

    const levelId = (index + 1 - a) * 2 - b;
    let buttonText = `Level ${levelId}`;
    const isLevelComplete = getItem(`complete-${levelId}`);
    if (isLevelComplete) buttonText += "\n    ✔";
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
  });
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
}

let currentCanvasPos = Vector(0, 0);
let scrollStartPos = Vector(0, 0);
on(GameEvent.drag, ({ detail }: any) => {
  currentCanvasPos = scrollStartPos.add(Vector(-detail.diffX, 0));
  // TODO set max and min scroll
});
on(GameEvent.burstBalloon, (balloon: Balloon) => {
  balloon.particles.forEach((particle: any) => {
    levelPersistentObjects.push(particle);
  });
});
on(GameEvent.down, () => {
  scrollStartPos = Vector(currentCanvasPos);
});

on(GameEvent.play, ({ levelId }: any) => {
  setTimeout(() => {
    currentLevelId = levelId;
    nextScene = "level";
    sceneTransition.reset();
    transitionLoop.start();
  }, 500);
});

on(GameEvent.selectLevel, () => {
  setTimeout(() => {
    nextScene = "select";
    sceneTransition.reset();
    transitionLoop.start();
  }, 500);
});

const mainLoop = GameLoop({
  update: function () {
    if (activeScene === "menu") {
      camera?.follow(Vector(0, 0));
      mainMenuObjects.forEach((object: any) => object.update());
    } else if (activeScene === "select") {
      camera?.follow(currentCanvasPos);
      selectLevelObjects.forEach((object: any) => object.update());
    } else {
      _objects.forEach((object) => object.update());
      levelPersistentObjects.forEach((object) => object.update());
      camera?.follow(_player?.centerPoint.add(Vector(200, -100)));
      // consider not adding levelpersitent objects to the collision detection
      handleCollision([..._objects, ...levelPersistentObjects]);
      handleLevelClear();
    }
  },
  render: function () {
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    camera.clear(context);
    camera.apply(context);
    if (activeScene === "menu") {
      mainMenuObjects.forEach((object: any) => object.render(context));
    } else if (activeScene === "select") {
      selectLevelObjects.forEach((object: any) => object.render(context));
    } else {
      _objects.forEach((object) => object.render(context));
      levelPersistentObjects.forEach((object) => object.render(context));
    }
  },
});

const transitionLoop = GameLoop({
  update: function () {
    sceneTransition?.update();
    if (!fadeinComplete && sceneTransition.isFadeInComplete()) {
      fadeinComplete = true;
      if (nextScene === "select") {
        activeScene = "select";
      } else if (nextScene === "level") {
        startLevel("level");
      }
    } else if (sceneTransition.isFadeOutComplete()) {
      fadeinComplete = false;
      sceneTransition?.reset();
      transitionLoop.stop();
    }
  },
  render: function () {
    const context = transitionCanvas.getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    sceneTransition?.render(context);
  },
});

const hudObjects: any[] = [];

const hudLoop = GameLoop({
  update: function () {
    hudObjects.forEach((object: any) => object.update());
  },
  render: function () {
    const context = hudCanvas.getContext("2d") as CanvasRenderingContext2D;
    hudObjects.forEach((object: any) => object.render(context));
  },
});

async function startLevel(scene: SceneId = "menu") {
  activeScene = scene;
  if (!gameHasStarted) {
    listenForResize(
      [hudCanvas, transitionCanvas, canvas],
      [createLevelSelectButtons]
    );

    hudLoop.start();
    initializeInputController(canvas);
    camera = new Camera(canvas);
  }
  const { player, goal, gameObjects } = initLevel(
    canvas,
    camera,
    currentLevelId
  );
  _player = player;
  _goal = goal;
  _objects = gameObjects;
  _objects.splice(0, 0, _player);
  _objects.splice(0, 0, goal);
  // todo cleanup existing objects

  gameHasStarted = true;
  mainLoop.start(); // start the game
  // initThirdweb();
}

function handleLevelClear() {
  if (isDisplayingLevelClearScreen || isDisplayingPlayerDiedScreen) return;
  if (_player.state === "dead") {
    isDisplayingPlayerDiedScreen = true;
    _objects.push(
      Text({
        x: _player.centerPoint.x,
        y: _player.centerPoint.y,
        font: "32px Arial",
        text: "Bubble burst!", // TODO add more variation to text
        context: canvas.getContext("2d") as CanvasRenderingContext2D,
      })
    );
    setTimeout(() => {
      _objects.length = 0;
      isDisplayingPlayerDiedScreen = false;
      mainLoop.stop();
      startLevel("level");
    }, 2000);
  }
  if (_goal.checkIfGoalReached(_player)) {
    isDisplayingLevelClearScreen = true;
    levelPersistentObjects.length = 0;
    setTimeout(() => {
      _objects.length = 0;
      isDisplayingLevelClearScreen = false;
      setItem(`complete-${currentLevelId}`, "true");
      currentLevelId++;
      mainLoop.stop();
      sceneTransition.reset();
      transitionLoop.start();
    }, 0);
  }
}

startLevel("menu");
