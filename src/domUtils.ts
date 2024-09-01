let resizeTimeout: number | undefined;
let isEmbedding = false;
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
      context.scale(devicePixelRatio, devicePixelRatio);
    }
  });
}

export function listenForResize(
  allCanvas: HTMLCanvasElement[],
  callbackFunctions?: Function[]
) {
  gameCanvases = allCanvas;
  function debouncedResize() {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    resizeTimeout = window.setTimeout(() => {
      scaleCanvas();
      callbackFunctions?.forEach((callback) => callback());
    }, 150);
  }

  // Listen for resize events
  window.addEventListener("resize", debouncedResize);
  scaleCanvas();
  callbackFunctions?.forEach((callback) => callback());
}

export function embedWeb3Version() {
  if (isEmbedding) return;
  isEmbedding = true;
  const iframe = document.createElement("iframe");
  iframe.src = "https://js13kgames2024.netlify.app/";
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";

  // Remove all other canvas elements on the page
  const canvasElements = document.querySelectorAll("canvas");
  canvasElements.forEach((canvas: HTMLCanvasElement) => {
    canvas.remove();
  });

  document.body.appendChild(iframe);
}
