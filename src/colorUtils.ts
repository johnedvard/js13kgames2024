export function getColorBasedOnGasAmount(gasAmount: number): string {
  const maxGasAmount = 130000;
  const threshold = 20000;

  // Ensure gasAmount is within the range
  gasAmount = Math.max(0, Math.min(gasAmount, maxGasAmount));

  // Define start (green) and end (red) colors in RGB
  const startColor = { r: 50, g: 150, b: 155 }; // Green
  const endColor = { r: 255, g: 20, b: 20 }; // Red

  // Calculate the interpolation factor
  const factor = (gasAmount - threshold) / (maxGasAmount - threshold);

  // Interpolate between the start and end colors
  const r = Math.round(startColor.r + factor * (endColor.r - startColor.r));
  const g = Math.round(startColor.g + factor * (endColor.g - startColor.g));
  const b = Math.round(startColor.b + factor * (endColor.b - startColor.b));

  // Return the color as a CSS-compatible string
  return `rgb(${r}, ${g}, ${b})`;
}