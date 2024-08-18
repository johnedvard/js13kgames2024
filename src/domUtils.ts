let resizeTimeout: number | undefined;

document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});
let canvas: HTMLCanvasElement;

function scaleCanvas() {
  const { width, height } = canvas;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Calculate the scale to fit the canvas inside the viewport while maintaining aspect ratio
  const scale = Math.min(screenWidth / width, screenHeight / height);
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  // Apply the calculated scale to the canvas
  canvas.style.width = `${scaledWidth}px`;
  canvas.style.height = `${scaledHeight - 15}px`;
  canvas.style.position = "absolute";
  canvas.style.left = `${(screenWidth - scaledWidth) / 2}px`;
  canvas.style.top = `${(screenHeight - scaledHeight) / 2 + 5}px`;
}

export function listenForResize(gameCanvas: HTMLCanvasElement) {
  canvas = gameCanvas;
  function debouncedResize() {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    resizeTimeout = window.setTimeout(scaleCanvas, 150);
  }

  // Listen for resize events
  window.addEventListener("resize", debouncedResize);
  scaleCanvas();
}
