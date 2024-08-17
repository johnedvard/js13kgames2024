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

function onMouseDown() {
  isTouching = true;
}

function onMouseUp() {
  isTouching = false;
}

function onTouchStart() {
  isTouching = true;
}

function onTouchEnd() {
  isTouching = false;
}

export function isUserTouching(): boolean {
  return isTouching;
}
