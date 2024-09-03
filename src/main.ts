import { init, GameLoop, Vector, Text, on } from "kontra";
// import { initThirdweb } from "./thirdweb";
import { Balloon } from "./Balloon";
import { initializeInputController } from "./inputController";
import { Camera } from "./Camera";
import { createLevelSelectObjects, initLevel } from "./levelUtils";
import { embedWeb3Version, listenForResize } from "./domUtils";
import { handleCollision } from "./gameUtils";
import { Goal } from "./Goal";
import { SceneTransition } from "./SceneTransition";
import { GameEvent } from "./GameEvent";

import { BubbleButton } from "./BubbleButton";
import { setItem } from "./storageUtils";
import { playGoal } from "./audio";
import { initThirdweb } from "./thirdweb";
import { getColorBasedOnGasAmount } from "./colorUtils";

const { canvas } = init("g");
const { canvas: transitionCanvas } = init("t");
const { canvas: backgroundCanvas } = init("b");
// These are just in-game values, not the actual canvas size
export const GAME_HEIGHT = 1840;
export const GAME_WIDTH = 2548;

type SceneId = "m" | "l" | "s"; // menu, level, select
let activeScene: SceneId = "m";
let nextScene: SceneId = "l";
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
let renderBg = false;

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
mainMenuObjects.push(playBtn);

if (import.meta.env.MODE !== "web3") {
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
} else {
  const text = Text({
    x: 0,
    y: 120,
    color: getColorBasedOnGasAmount(1000),
    text: "Web3 enabled. Fetching random NPCs",
    font: "32px Arial",
    anchor: { x: 0.5, y: 0.5 },
    context: canvas.getContext("2d") as CanvasRenderingContext2D,
  });
  mainMenuObjects.push(text);
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

on(GameEvent.play, ({ levelId }: any) => {
  renderBg = true;
  setTimeout(() => {
    currentLevelId = levelId;
    nextScene = "l";
    sceneTransition.reset();
    transitionLoop.start();
  }, 500);
});

on(GameEvent.web3, () => {
  embedWeb3Version();
});

on(GameEvent.selectLevel, () => {
  setTimeout(() => {
    nextScene = "s";
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
}
function destroySelectLevelObjects() {
  selectLevelObjects.forEach((object: any) => {
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

let bgExcessWidth = 2000;
// Function to draw random waves that look like hills
function drawWaves(
  bgCanvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  camera: Camera
) {
  const height = 600;
  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
  context.translate(camera.pos.x / -5, camera.pos.y / -4); // Apply camera translation parallax effect
  const { width: canvasWidth, height: canvasHeight } = bgCanvas;
  // Create gradient
  const gradient = context.createLinearGradient(
    0,
    canvasHeight - 200,
    0,
    canvasHeight
  );
  gradient.addColorStop(0, "#01011388");
  gradient.addColorStop(1, "#060e1a88");

  context.fillStyle = gradient;
  context.beginPath();
  context.moveTo(-bgExcessWidth, height);
  context.fillRect(
    -bgExcessWidth,
    height,
    canvasWidth + bgExcessWidth * 2,
    canvasHeight
  );
  for (let i = -bgExcessWidth; i <= canvasWidth + bgExcessWidth; i += 50) {
    // const waveHeight = Math.sin(i * 0.03) * 50 + 150;
    const waveHeight = Math.sin(i * 0.03) * 50 + 150;
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
    currentLevelId
  );
  _player = player;
  _goal = goal;
  _objects = gameObjects;
  _objects.splice(0, 0, _player);
  _objects.splice(0, 0, goal);
  // todo cleanup existing objects

  gameHasStarted = true;
  console.log("start main loop");
  mainLoop.start(); // start the game
}
if (import.meta.env.MODE === "web3") {
  console.log("init thirdweb");
  initThirdweb();
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
    console.log("play goal");
    playGoal();
    isDisplayingLevelClearScreen = true;
    levelPersistentObjects.length = 0;
    setTimeout(() => {
      _objects.length = 0;
      isDisplayingLevelClearScreen = false;
      setItem(`complete-${currentLevelId}`, "true");
      currentLevelId++;
      if (currentLevelId === 13) currentLevelId++;
      mainLoop.stop();
      sceneTransition.reset();
      transitionLoop.start();
    }, 20);
  }
}

startLevel("m");
