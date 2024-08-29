import { Vector, emit } from "kontra";
import { GameEvent } from "./GameEvent";
import { playSong } from "./audio";

let isTouching = false;
let isDragging = false;
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;
let _canvas: HTMLCanvasElement;

export function initializeInputController(canvas: HTMLCanvasElement) {
  _canvas = canvas;
  // Mouse events
  _canvas.addEventListener("mousedown", onMouseDown);
  _canvas.addEventListener("mouseup", onMouseUp);
  _canvas.addEventListener("mousemove", onMouseMove);

  // Touch events
  _canvas.addEventListener("touchstart", onTouchStart, { passive: false });
  _canvas.addEventListener("touchend", onTouchEnd);
  _canvas.addEventListener("touchmove", onTouchMove);
}

export function cleanupInputController() {
  // Mouse events
  _canvas.removeEventListener("mousedown", onMouseDown);
  _canvas.removeEventListener("mouseup", onMouseUp);
  _canvas.removeEventListener("mousemove", onMouseMove);

  // Touch events
  _canvas.removeEventListener("touchstart", onTouchStart);
  _canvas.removeEventListener("touchend", onTouchEnd);
  _canvas.removeEventListener("touchmove", onTouchMove);
}

function onMouseDown(e: MouseEvent) {
  isTouching = true;
  isDragging = false;
  startX = e.clientX * window.devicePixelRatio;
  startY = e.clientY * window.devicePixelRatio;
  emit(GameEvent.down, Vector(startX, startY));
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
  isDragging = false;
  playSong();
  emit(GameEvent.up, Vector(startX, startY));
}

function onMouseMove(e: MouseEvent) {
  if (isTouching) {
    currentX = e.clientX * window.devicePixelRatio;
    currentY = e.clientY * window.devicePixelRatio;
    if (!isDragging) {
      isDragging = true;
    }
    emitDragEvent();
  }
}

function onTouchStart(e: TouchEvent) {
  isTouching = true;
  isDragging = false;
  const touch = e.touches[0];
  startX = touch.clientX * window.devicePixelRatio;
  startY = touch.clientY * window.devicePixelRatio;
  emit(GameEvent.down, Vector(startX, startY));
  e.preventDefault();
  return false;
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
  isDragging = false;
}

function onTouchMove(e: TouchEvent) {
  if (isTouching) {
    const touch = e.touches[0];
    currentX = touch.clientX * window.devicePixelRatio;
    currentY = touch.clientY * window.devicePixelRatio;
    if (!isDragging) {
      isDragging = true;
    }
    emitDragEvent();
  }
}

function emitDragEvent() {
  const diffX = currentX - startX;
  const diffY = currentY - startY;
  emit(GameEvent.drag, {
    detail: { diffX, diffY },
  });
}

export function isUserTouching(): boolean {
  return isTouching;
}
