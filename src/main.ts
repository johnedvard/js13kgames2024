import { init, GameLoop, Vector } from "kontra";
// import { initThirdweb } from "./thirdweb";
import { Balloon } from "./Balloon";
import { projectPointOntoSegment, rayIntersectsSegment } from "./mathUtils";
import { RigidBody } from "./RigidBody";
import { Particle } from "./Particle";
import { Spring } from "./Spring";
import { initializeInputController } from "./inputController";
const { canvas, context } = init("game");

let closestPointOnLine: Vector | null = null;
const objects: any[] = [];

document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

function initGameObjects(zoom = 1) {
  const player = new Balloon(Vector(150, canvas.height / zoom - 350));
  // const player2 = new Balloon(Vector(290, 150));
  const body = new RigidBody(Vector(700, canvas.height / zoom - 150), 150, 150);
  const body2 = new RigidBody(
    Vector(900, canvas.height / zoom - 350),
    350,
    350
  );
  const body3 = new RigidBody(
    Vector(-100, canvas.height / zoom - 1150),
    canvas.width / zoom + 200,
    200
  );
  objects.push(player);
  objects.push(body);
  objects.push(body2);
  objects.push(body3);
  // objects.push(player2);
}

const loop = GameLoop({
  update: function () {
    objects.forEach((object) => object.update());

    closestPointOnLine = null;
    for (let i = 0; i < objects.length; i++) {
      const object = objects[i];
      object.particles.forEach((particle: Particle) => {
        let intersections = 0;
        for (let j = 0; j < objects.length; j++) {
          if (i !== j) {
            const otherObject = objects[j];
            otherObject.springs.forEach((spring: Spring) => {
              if (
                object instanceof Balloon &&
                rayIntersectsSegment(particle.pos, spring.p1.pos, spring.p2.pos)
              ) {
                intersections++;
              }
              const tmpClosestPoint = projectPointOntoSegment(
                particle.pos,
                spring.p1.pos,
                spring.p2.pos
              );
              if (
                !closestPointOnLine ||
                tmpClosestPoint.distance(particle.pos) <
                  closestPointOnLine.distance(particle.pos)
              ) {
                closestPointOnLine = tmpClosestPoint;
              }
            });
          }
        }

        if (intersections % 2 === 1 && closestPointOnLine) {
          // Particle is inside another object
          particle.pos = Vector(closestPointOnLine);
          particle.velocity = particle.velocity.scale(-1); // adjust the velocity to simulate a bounce
        }
      });
    }
  },
  render: function () {
    const context = this.context as CanvasRenderingContext2D;
    objects.forEach((object) => object.render(context));
    if (closestPointOnLine) {
      context.beginPath();
      context.arc(
        closestPointOnLine.x,
        closestPointOnLine.y,
        5,
        0,
        2 * Math.PI
      );
      context.fillStyle = "#fff";
      context.fill();
    }
  },
});

async function boot() {
  console.log("start");

  const { width, height } = canvas;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Calculate the scale to fit the canvas inside the viewport while maintaining aspect ratio
  const scale = Math.min(screenWidth / width, screenHeight / height);
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  // Apply the calculated scale to the canvas
  canvas.style.width = `${scaledWidth}px`;
  canvas.style.height = `${scaledHeight}px`;
  canvas.style.position = "absolute";
  canvas.style.left = `${(screenWidth - scaledWidth) / 2}px`;
  canvas.style.top = `${(screenHeight - scaledHeight) / 2}px`;
  const zoom = 1;
  context.scale(zoom, zoom);
  initializeInputController();
  initGameObjects(zoom);
  addWalls(canvas, zoom);
  loop.start(); // start the game
  // initThirdweb();
}

function addWalls(canvas: HTMLCanvasElement, scale: number = 1) {
  const topWall = new RigidBody(
    Vector(-100, -100),
    canvas.width / scale + 200,
    100
  );
  const leftWall = new RigidBody(
    Vector(-100, -100),
    100,
    canvas.height / scale + 200
  );
  const bottomWall = new RigidBody(
    Vector(-100, canvas.height / scale),
    canvas.width / scale + 200,
    100
  );
  const rightWall = new RigidBody(
    Vector(canvas.width / scale, -100),
    100,
    canvas.height / scale + 200
  );
  objects.push(topWall, leftWall, bottomWall, rightWall);
}

boot();
