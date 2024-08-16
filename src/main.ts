import { init, GameLoop } from "kontra";
import { initThirdweb } from "./thirdweb";
import { Balloon } from "./Balloon";

const player = new Balloon();
const { canvas } = init("game");

const loop = GameLoop({
  update: function () {
    player.update();
  },
  render: function () {
    player.render(this.context as CanvasRenderingContext2D);
  },
});

async function boot() {
  console.log("start");
  loop.start(); // start the game
  initThirdweb();

  const { width, height } = canvas;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const scale = Math.min(screenWidth / width, screenHeight / height);
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  canvas.style.width = `${scaledWidth}px`;
  canvas.style.height = `${scaledHeight}px`;
  canvas.style.position = "absolute";
  canvas.style.left = `${(screenWidth - scaledWidth) / 2}px`;
  canvas.style.top = `${(screenHeight - scaledHeight) / 2}px`;
}

boot();
