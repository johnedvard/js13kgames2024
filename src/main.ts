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

let closestPointOnLine: Vector | null = null;
let _objects: any[] = [];
let _player: Balloon;
let _goal: Goal;
let camera: Camera;
let currentLevelId = 1;
let gameHasStarted = false;

const loop = GameLoop({
  update: function () {
    _objects.forEach((object) => object.update());
    // Follow the player with the camera
    camera?.follow(_player?.centerPoint.add(Vector(200, -100)));
    closestPointOnLine = null;
    // handle collision, move to other file
    handleCollision(_objects);
    if (_goal.checkIfGoalReached(_player)) {
      loop.stop();
      _objects.length = 0;

      currentLevelId++;
      boot();
    }
  },
  render: function () {
    const context = this.context as CanvasRenderingContext2D;
    // Clear the canvas
    camera.clear(context);

    // Apply the camera transformation
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

boot();
