let resizeTimeout: number | undefined;

// document.addEventListener("contextmenu", function (e) {
//   e.preventDefault();
// });
let gameCanvases: HTMLCanvasElement[];

function scaleCanvas() {
  gameCanvases.forEach((canvas) => {
    const { width, height } = canvas;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const devicePixelRatio = window.devicePixelRatio || 1;

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

    // Scale the canvas context to match the device pixel ratio
    const context = canvas.getContext("2d");
    if (context) {
      console.log("scale");
      context.scale(devicePixelRatio, devicePixelRatio);
    }
  });
}

export function listenForResize(allCanvas: HTMLCanvasElement[]) {
  gameCanvases = allCanvas;
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
