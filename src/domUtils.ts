let resizeTimeout: number | undefined;

// document.addEventListener("contextmenu", function (e) {
//   e.preventDefault();
// });
let gameCanvases: HTMLCanvasElement[];

function scaleCanvas() {
  gameCanvases.forEach((canvas) => {
    
    const devicePixelRatio = window.devicePixelRatio || 1;
    // Apply the calculated scale to the canvas
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.position = "absolute";
    canvas.style.left = "0";
    canvas.style.top = "0";

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
