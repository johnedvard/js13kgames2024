import { init, GameLoop, Vector, Text, on } from "kontra";
// import { initThirdweb } from "./thirdweb";
import { Balloon } from "./Balloon";
import { initializeInputController } from "./inputController";
import { Camera } from "./Camera";
import { initLevel } from "./levelUtils";
import { listenForResize } from "./domUtils";
import { handleCollision } from "./gameUtils";
import { Goal } from "./Goal";
import { SceneTransition } from "./SceneTransition";
import { GameEvent } from "./GameEvent";

const { canvas } = init("game");
const { canvas: transitionCanvas } = init("transition");
const { canvas: hudCanvas } = init("hud");
// These are just in-game values, not the actual canvas size
export const GAME_HEIGHT = 1840;
export const GAME_WIDTH = 2548;
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

on(GameEvent.burstBalloon, (balloon: Balloon) => {
  balloon.particles.forEach((particle: any) => {
    levelPersistentObjects.push(particle);
  });
});

const mainLoop = GameLoop({
  update: function () {
    _objects.forEach((object) => object.update());
    levelPersistentObjects.forEach((object) => object.update());
    camera?.follow(_player?.centerPoint.add(Vector(200, -100)));
    // consider not adding levelpersitent objects to the collision detection
    handleCollision([..._objects, ...levelPersistentObjects]);
    handleLevelClear();
  },
  render: function () {
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    camera.clear(context);
    camera.apply(context);
    _objects.forEach((object) => object.render(context));
    levelPersistentObjects.forEach((object) => object.render(context));
  },
});

let fadeinComplete = false;

const transitionLoop = GameLoop({
  update: function () {
    sceneTransition?.update();
    if (!fadeinComplete && sceneTransition.isFadeInComplete()) {
      fadeinComplete = true;
      startLevel();
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

const hudLoop = GameLoop({
  update: function () {},
  render: function () {
    // const context = hudCanvas.getContext("2d") as CanvasRenderingContext2D;
    console.log("rendering hud");
  },
});

async function startLevel() {
  console.log("starting level");
  if (!gameHasStarted) {
    listenForResize([canvas, transitionCanvas, hudCanvas]);
    hudLoop.start();
    initializeInputController();
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
      startLevel();
    }, 2000);
  }
  if (_goal.checkIfGoalReached(_player)) {
    isDisplayingLevelClearScreen = true;
    levelPersistentObjects.length = 0;

    setTimeout(() => {
      _objects.length = 0;
      isDisplayingLevelClearScreen = false;
      currentLevelId++;
      mainLoop.stop();
      transitionLoop.start();
    }, 0);
  }
}
startLevel();
