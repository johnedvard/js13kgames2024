let isTouching = false;

export function initializeInputController() {
  // Mouse events
  window.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mouseup", onMouseUp);

  // Touch events
  window.addEventListener("touchstart", onTouchStart);
  window.addEventListener("touchend", onTouchEnd);
}

export function cleanupInputController() {
  // Mouse events
  window.removeEventListener("mousedown", onMouseDown);
  window.removeEventListener("mouseup", onMouseUp);

  // Touch events
  window.removeEventListener("touchstart", onTouchStart);
  window.removeEventListener("touchend", onTouchEnd);
}

function onMouseDown(event: MouseEvent) {
  isTouching = true;
  console.log("Mouse down", isTouching);
}

function onMouseUp(event: MouseEvent) {
  isTouching = false;
  console.log("Mouse up", isTouching);
}

function onTouchStart(event: TouchEvent) {
  isTouching = true;
  console.log("Touch start", isTouching);
}

function onTouchEnd(event: TouchEvent) {
  isTouching = false;
  console.log("Touch end", isTouching);
}

export function isUserTouching(): boolean {
  return isTouching;
}
