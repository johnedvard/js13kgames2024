import { init, GameLoop, Vector, Text, on } from "kontra";
import { Balloon } from "./Balloon";
import { initializeInputController } from "./inputController";
import { Camera } from "./Camera";
import { createLevelSelectObjects, initLevel, numLevels } from "./levelUtils";
import { listenForResize } from "./domUtils";
import { handleCollision } from "./gameUtils";
import { Goal } from "./Goal";
import { SceneTransition } from "./SceneTransition";
import { GameEvent } from "./GameEvent";

import { BubbleButton } from "./BubbleButton";
import { setItem } from "./storageUtils";
import { playGoal } from "./audio";
import { getColorBasedOnGasAmount } from "./colorUtils";
import { initThirdweb } from "./thirdweb";

const { canvas } = init("g");
const { canvas: transitionCanvas } = init("t");
const { canvas: backgroundCanvas } = init("b");
// These are just in-game values, not the actual canvas size
export const GAME_WIDTH = 2548;

type SceneId = "m" | "l" | "s" | "b"; // menu, level, select, bonus
let activeScene: SceneId = "m";
let nextScene: SceneId = "l";
const sceneTransition = new SceneTransition(transitionCanvas);
let _objects: any[] = [];
let _player: Balloon;
let _goal: Goal;
let camera: Camera;
let currentLevelId = 1;
let currentLevelData: any = null;
let gameHasStarted = false;
let isDisplayingLevelClearScreen = false;
let isDisplayingPlayerDiedScreen = false;
const levelPersistentObjects: any[] = [];
let fadeinComplete = false; // used to control the fadein out transtiion

let bonusLevels: any[] = [];
const mainMenuObjects: any = [];
const selectLevelObjects: any = [];
const selectBonusLevelObjects: any = [];
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
mainMenuObjects.push(playBtn);

const web3Btn = new BubbleButton(
  canvas,
  0,
  120,
  75,
  "Web3",
  40,
  GameEvent.web3,
  {}
);
mainMenuObjects.push(web3Btn);

export function addBonusLevelBtn() {
  const bonusPlayLvlBtn = new BubbleButton(
    canvas,
    0,
    120,
    75,
    "Bonus",
    40,
    GameEvent.selectLevel,
    { type: "b" } // bonus
  );
  mainMenuObjects.push(bonusPlayLvlBtn);
}
export function addBonusLevels(levels: any[]) {
  bonusLevels = levels;
  bonusLevels.sort((a, b) => a.levelId - b.levelId);
  recreateBonusLevels(canvas, bonusLevels);
}
function recreateBonusLevels(canvas: HTMLCanvasElement, levels: any[]) {
  selectBonusLevelObjects.length = 0;
  createLevelSelectObjects(canvas, {
    bonusLevels: levels,
  }).forEach((obj) => selectBonusLevelObjects.push(obj));
}
function createLevelSelect() {
  selectLevelObjects.length = 0;
  createLevelSelectObjects(canvas).forEach((obj) => {
    selectLevelObjects.push(obj);
  });
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

on(GameEvent.play, ({ levelId, levelData }: any) => {
  setTimeout(() => {
    currentLevelId = levelId;
    currentLevelData = levelData;
    nextScene = "l";
    sceneTransition.reset();
    transitionLoop.start();
  }, 500);
});

on(GameEvent.web3, () => {
  initThirdweb();
  const text = Text({
    x: 0,
    y: -250,
    color: getColorBasedOnGasAmount(1000),
    text: "Web3 enabled\nFetching NPCs and bonus levels",
    font: "32px Arial",
    anchor: { x: 0.5, y: 0.5 },
    textAlign: "center",
    context: canvas.getContext("2d") as CanvasRenderingContext2D,
  });
  mainMenuObjects.push(text);
});

on(GameEvent.selectLevel, ({ type }: { type: string }) => {
  setTimeout(() => {
    if (type === "b") {
      nextScene = "b";
    } else {
      nextScene = "s";
    }
    sceneTransition.reset();
    transitionLoop.start();
  }, 500);
});

const mainLoop = GameLoop({
  update: function () {
    if (activeScene === "m") {
      camera?.follow(Vector(0, 0));
      mainMenuObjects.forEach((object: any) => object.update());
    } else if (activeScene === "s") {
      camera?.follow(currentCanvasPos);
      selectLevelObjects.forEach((object: any) => object.update());
    } else if (activeScene === "b") {
      camera?.follow(currentCanvasPos);
      selectBonusLevelObjects.forEach((object: any) => object.update());
    } else {
      updateBackgroundCanvas();
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
    if (activeScene === "m") {
      mainMenuObjects.forEach((object: any) => object.render(context));
    } else if (activeScene === "s") {
      selectLevelObjects.forEach((object: any) => object.render(context));
    } else if (activeScene === "b") {
      selectBonusLevelObjects.forEach((object: any) => object.render(context));
    } else {
      renderBackgroundCanvas(camera);
      _objects.forEach((object) => object.render(context));
      levelPersistentObjects.forEach((object) => object.render(context));
    }
  },
});

function updateBackgroundCanvas() {}
function renderBackgroundCanvas(camera: Camera) {
  const context = backgroundCanvas.getContext("2d") as CanvasRenderingContext2D;
  drawWaves(backgroundCanvas, context, camera);
  drawWaves(backgroundCanvas, context, camera, { type: "h" });
}
function destroySelectLevelObjects() {
  selectLevelObjects.forEach((object: any) => {
    if (object?.destroy) object.destroy();
  });
  selectBonusLevelObjects.forEach((object: any) => {
    if (object?.destroy) object.destroy();
  });
}

const transitionLoop = GameLoop({
  update: function () {
    sceneTransition?.update();
    if (!fadeinComplete && sceneTransition.isFadeInComplete()) {
      fadeinComplete = true;
      if (nextScene === "s") {
        activeScene = "s";
        mainMenuObjects.forEach((object: any) => {
          object && object.destroy && object.destroy();
        });
        mainMenuObjects.length = 0;
      } else if (nextScene === "b") {
        activeScene = "b";
        mainMenuObjects.forEach((object: any) => {
          object && object.destroy && object.destroy();
        });
        mainMenuObjects.length = 0;
      } else if (nextScene === "l") {
        startLevel("l");
        destroySelectLevelObjects();
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

type WaveOptions = {
  type: "h" | "";
};

let bgExcessWidth = 2000;
// Function to draw random waves that look like hills
function drawWaves(
  bgCanvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  camera: Camera,
  options?: WaveOptions
) {
  const height = 600;
  context.save();
  const { width: canvasWidth, height: canvasHeight } = bgCanvas;
  // Create gradient
  const gradient = context.createLinearGradient(
    0,
    canvasHeight - 200,
    0,
    canvasHeight
  );
  context.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
  if (options?.type === "h") {
    gradient.addColorStop(0, "#010113");
    gradient.addColorStop(1, "#060e1a");
    context.translate(camera.pos.x / -3, camera.pos.y / -4); // Apply camera translation parallax effect
  } else {
    gradient.addColorStop(0, "#212133aa");
    gradient.addColorStop(1, "#060e1a88");
    context.translate(camera.pos.x / -7, camera.pos.y / -5); // Apply camera translation parallax effect
  }

  context.fillStyle = gradient;
  context.beginPath();
  context.moveTo(-bgExcessWidth, height);
  context.fillRect(
    -bgExcessWidth,
    height - 20,
    canvasWidth + bgExcessWidth * 2,
    canvasHeight
  );
  for (let i = -bgExcessWidth; i <= canvasWidth + bgExcessWidth; i += 50) {
    let waveHeight = 0;
    if (options?.type === "h") {
      waveHeight = Math.sin(i * 0.02) * 20 + 150;
    } else {
      waveHeight = Math.sin(i * 0.01) * 20 + 260;
    }
    context.lineTo(i, height - waveHeight);
  }
  context.lineTo(canvasWidth + bgExcessWidth, height);
  context.closePath();
  context.fill();
  context.restore();
}

async function startLevel(scene: SceneId = "m") {
  activeScene = scene;
  if (!gameHasStarted) {
    listenForResize(
      [backgroundCanvas, transitionCanvas, canvas],
      [createLevelSelect]
    );
    initializeInputController(canvas);
    camera = new Camera(canvas);
  }

  const { player, goal, gameObjects } = initLevel(
    canvas,
    camera,
    currentLevelId,
    currentLevelData
  );
  _player = player;
  _goal = goal;
  _objects = gameObjects;
  _objects.splice(0, 0, _player);
  _objects.splice(0, 0, goal);
  // todo cleanup existing objects

  gameHasStarted = true;
  mainLoop.start(); // start the game
}

function handleLevelClear() {
  if (isDisplayingLevelClearScreen || isDisplayingPlayerDiedScreen) return;
  if (_player.state === "d") {
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
      startLevel("l");
    }, 2000);
  }
  if (_goal.checkIfGoalReached(_player) && !isDisplayingLevelClearScreen) {
    playGoal();
    isDisplayingLevelClearScreen = true;
    levelPersistentObjects.length = 0;
    setTimeout(() => {
      _objects.length = 0;
      isDisplayingLevelClearScreen = false;
      if (currentLevelData) {
        // assume that we are playing bonus level,
        setItem(`complete-bonus-${currentLevelId}`, "true");
        currentLevelData = bonusLevels.find(
          (l) => l.levelId === currentLevelId + 1
        );
        currentLevelId++;
        if (!currentLevelData) {
          // display theanks for playing screen when we don't have more bonus levels
          currentLevelId = numLevels();
        }
      } else {
        // assume we are playing regular level
        setItem(`complete-${currentLevelId}`, "true");
        currentLevelId++;
        if (currentLevelId === 13) currentLevelId++;
      }
      mainLoop.stop();
      sceneTransition.reset();
      transitionLoop.start();
    }, 20);
  }
}

startLevel("m");
