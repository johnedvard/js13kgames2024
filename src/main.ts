import { init, GameLoop, Vector } from "kontra";
// import { initThirdweb } from "./thirdweb";
import { Balloon } from "./Balloon";
import { initializeInputController } from "./inputController";
import { Camera } from "./Camera";
import { initLevel } from "./levelUtils";
import { listenForResize } from "./domUtils";
import { handleCollision } from "./gameUtils";
import { Goal } from "./Goal";

const { canvas } = init("game");

// Remember to use the same values as the canvas element in index
export const GAME_HEIGHT = 1840;
export const GAME_WIDTH = 2548;

let _objects: any[] = [];
let _player: Balloon;
let _goal: Goal;
let camera: Camera;
let currentLevelId = 1;
let gameHasStarted = false;
let isDisplayingLevelClearScreen = false;
let isDisplayingPlayerDiedScreen = false;

const loop = GameLoop({
  update: function () {
    _objects.forEach((object) => object.update());
    camera?.follow(_player?.centerPoint.add(Vector(200, -100)));
    handleCollision(_objects);
    handleLevelClear();
  },
  render: function () {
    const context = this.context as CanvasRenderingContext2D;
    camera.clear(context);
    camera.apply(context);
    _objects.forEach((object) => object.render(context));
  },
});

async function boot() {
  if (!gameHasStarted) {
    listenForResize(canvas);
    initializeInputController();
    camera = new Camera(canvas);
  }
  const { player, goal, gameObjects } = initLevel(camera, currentLevelId);
  _player = player;
  _goal = goal;
  _objects = gameObjects;
  _objects.splice(0, 0, _player);
  _objects.splice(0, 0, goal);
  // todo cleanup existing objects

  loop.start(); // start the game
  gameHasStarted = true;
  // initThirdweb();
}

function handleLevelClear() {
  if (isDisplayingLevelClearScreen || isDisplayingPlayerDiedScreen) return;
  if (_player.state === "dead") {
    isDisplayingPlayerDiedScreen = true;
    setTimeout(() => {
      _objects.length = 0;
      isDisplayingPlayerDiedScreen = false;
      loop.stop();
      boot();
    }, 2000);
  }
  if (_goal.checkIfGoalReached(_player)) {
    isDisplayingLevelClearScreen = true;

    setTimeout(() => {
      _objects.length = 0;
      isDisplayingLevelClearScreen = false;
      loop.stop();
      currentLevelId++;
      boot();
    }, 0);
  }
}
boot();
