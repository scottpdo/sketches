const canvasSketch = require("canvas-sketch");
const { Environment, Terrain, utils, Vector, Colors } = require("flocc");
const { distance, remap } = utils;

const [width, height] = [2000, 2000];
const settings = {
  dimensions: [width, height],
};

const angle = (pt1, pt2) =>
  Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x) / (2 * Math.PI);

const environment = new Environment({ width, height });
const terrain = new Terrain(width, height);
environment.use(terrain);

const center = new Vector(width / 2, height / 2);
const centerInv = center.clone().multiplyScalar(-1);
const r2 = new Vector(center.x + width / 4, center.y);
const ring2arr = new Array(6)
  .fill(0)
  .map((k, i) => (2 * Math.PI * i) / 6)
  .map((a) => r2.clone().add(centerInv).rotateZ(a).add(center));
const r3 = new Vector(center.x + (17 * width) / 48, center.y);
const ring3arr = new Array(12)
  .fill(0)
  .map((k, i) => (2 * Math.PI * (i + 0.5)) / 12)
  .map((a) => r3.clone().add(centerInv).rotateZ(a).add(center));
const r4 = new Vector(center.x + (5 * width) / 12, center.y);
const ring4arr = new Array(24)
  .fill(0)
  .map((k, i) => (2 * Math.PI * (i + 0.5)) / 24)
  .map((a) => r4.clone().add(centerInv).rotateZ(a).add(center));
const r5 = new Vector(center.x + (11 * width) / 24, center.y);
const ring5arr = new Array(36)
  .fill(0)
  .map((k, i) => (2 * Math.PI * i) / 36)
  .map((a) => r5.clone().add(centerInv).rotateZ(a).add(center));

terrain.init((x, y) => {
  const d = distance({ x, y }, center);
  const ring1 = d < width / 6;
  if (
    ring1 ||
    ring2arr.some((a) => distance({ x, y }, a) < width / 15) ||
    ring3arr.some((a) => distance({ x, y }, a) < width / 25) ||
    ring4arr.some((a) => distance({ x, y }, a) < width / 40) ||
    ring5arr.some((a) => distance({ x, y }, a) < width / 72)
  )
    return Colors.BLUE;
  return { r: 0, g: 0, b: 0, a: 0 };
});

const sketch = () => {
  return ({ context, width, height }) => {
    const data = new ImageData(terrain.data, width, height);
    context.putImageData(data, 0, 0);
  };
};

canvasSketch(sketch, settings);
