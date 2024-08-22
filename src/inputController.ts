import { Vector, emit } from "kontra";
import { GameEvent } from "./GameEvent";

let isTouching = false;
let _canvas: HTMLCanvasElement;
export function initializeInputController(canvas: HTMLCanvasElement) {
  _canvas = canvas;
  // Mouse events
  _canvas.addEventListener("mousedown", onMouseDown);
  _canvas.addEventListener("mouseup", onMouseUp);

  // Touch events
  _canvas.addEventListener("touchstart", onTouchStart);
  _canvas.addEventListener("touchend", onTouchEnd);
}

export function cleanupInputController() {
  // Mouse events
  _canvas.removeEventListener("mousedown", onMouseDown);
  _canvas.removeEventListener("mouseup", onMouseUp);

  // Touch events
  _canvas.removeEventListener("touchstart", onTouchStart);
  _canvas.removeEventListener("touchend", onTouchEnd);
}

function onMouseDown() {
  isTouching = true;
}

function onMouseUp(e: MouseEvent) {
  // multiply with window.devicePixelRatio to get the actual canvas size (because we scale the canvas like this)
  emit(
    GameEvent.up,
    Vector(
      e.clientX * window.devicePixelRatio,
      e.clientY * window.devicePixelRatio
    )
  );

  isTouching = false;
}

function onTouchStart() {
  isTouching = true;
}

function onTouchEnd(e: TouchEvent) {
  const touch = e.changedTouches[0];
  emit(
    GameEvent.up,
    Vector(
      touch.clientX * window.devicePixelRatio,
      touch.clientY * window.devicePixelRatio
    )
  );
  isTouching = false;
}

export function isUserTouching(): boolean {
  return isTouching;
}
