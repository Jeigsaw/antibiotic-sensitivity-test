// Taken from https://stackoverflow.com/a/50746409/
export function randomPointInCircle(cx, cy, radius) {
  const t = 2 * Math.PI * Math.random();
  const u = Math.random() + Math.random();
  let r = u > 1 ? 2 - u : u;
  r *= radius;
  return {
    x: cx + r * Math.cos(t),
    y: cy + r * Math.sin(t)
  };
}