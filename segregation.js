import { Environment, Terrain, Colors, utils } from "flocc";
import canvasSketch from "canvas-sketch";
import SimplexNoise from "simplex-noise";

const [width, height] = [2000, 200];
const settings = {
  // animate: true,
  dimensions: [width, height],
};

const simplex = new SimplexNoise("123");
// const noise = (simplex.noise2D(x, y) + 1) / 2;
// console.log(noise);

const MOVE_THRESHOLD = (x, y) =>
  utils.remap(
    simplex.noise2D(x / (width / 6), y / (width / 6)),
    -1,
    1,
    0,
    0.85
  );
const PERCENT_EMPTY = 0.05;

const EMPTY = { r: 255, g: 255, b: 254, a: 255 };

const environment = new Environment({ width, height });
const terrain = new Terrain(width, height, { async: true });
environment.use(terrain);
terrain.init(() => {
  if (Math.random() < PERCENT_EMPTY) return EMPTY;
  return Math.random() > 0.5 ? Colors.WHITE : Colors.BLUE;
});

function areSame(p1, p2) {
  return p1.r === p2.r && p1.g === p2.g && p1.b === p2.b && p1.a === p2.a;
}

function existsCoord(x, y) {
  return !areSame(terrain.sample(x, y), EMPTY);
}

function existsPixel(px) {
  return !areSame(px, EMPTY);
}

function findOpenSpace() {
  let space = null;
  do {
    space = { x: utils.random(0, width), y: utils.random(0, height) };
  } while (existsCoord(space.x, space.y));
  return space;
}

function swap(x1, y1, x2, y2) {
  const p1 = terrain.sample(x1, y1);
  const p2 = terrain.sample(x2, y2);
  terrain.set(x2, y2, p1.r, p1.g, p1.b, p1.a);
  terrain.set(x1, y1, p2.r, p2.g, p2.b, p2.a);
}

terrain.addRule((x, y) => {
  const color = terrain.sample(x, y);
  if (environment.time < 56) {
    if (!existsPixel(color)) return;

    const neighbors = terrain.neighbors(x, y, 1, true).filter(existsPixel);
    const percentLike =
      neighbors.filter((n) => areSame(color, n)).length / neighbors.length;

    if (neighbors.length === 0) return;
    if (percentLike >= MOVE_THRESHOLD(x, y)) return;

    const open = findOpenSpace();
    if (open) swap(x, y, open.x, open.y);
  } else {
    const sum = { r: 0, g: 0, b: 0, a: 0 };
    const neighbors = terrain.neighbors(x, y, 1, true);
    neighbors.forEach((neighbor) => {
      sum.r += neighbor.r;
      sum.g += neighbor.g;
      sum.b += neighbor.b;
      sum.a += neighbor.a;
    });
    sum.r /= neighbors.length;
    sum.g /= neighbors.length;
    sum.b /= neighbors.length;
    sum.a /= neighbors.length;
    terrain.set(
      x,
      y,
      utils.lerp(color.r, sum.r, 0.25),
      utils.lerp(color.g, sum.g, 0.25),
      utils.lerp(color.b, sum.b, 0.25),
      utils.lerp(color.a, sum.a, 0.25)
    );
  }
});

const sketch = () => {
  return ({ context, width, height }) => {
    environment.tick(60);
    const imageData = new ImageData(terrain.data, width, height);
    context.putImageData(imageData, 0, 0);
  };
};

canvasSketch(sketch, settings);
