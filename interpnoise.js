import { Environment, Terrain, Colors, utils } from "flocc";
import canvasSketch from "canvas-sketch";
import SimplexNoise from "simplex-noise";

const [width, height] = [600, 600];
const settings = {
  animate: true,
  dimensions: [width, height]
};

const simplex = new SimplexNoise("123");
const simplex2 = new SimplexNoise("456");

const environment = new Environment({ width, height });
const terrain = new Terrain(width, height);
environment.use(terrain);

const r = (
  x,
  y,
  xShift = 1,
  yShift = 1,
  frequency = 1,
  offset = 0,
  scale = 1
) => {
  const { time } = environment;
  return utils.lerp(
    utils.remap(
      simplex.noise2D(
        (x + xShift * time) / (width * scale),
        (y + yShift * time) / (height * scale)
      ),
      -1,
      1,
      0,
      255
    ),
    utils.remap(
      simplex2.noise2D(
        (x + xShift * time) / (width * scale),
        (y + yShift * time) / (height * scale)
      ),
      -1,
      1,
      0,
      255
    ),
    (Math.sin((frequency * time) / 10 + offset) + 1) / 2
  );
};

terrain.addRule((x, y) => {
  return {
    r: r(x, y, 1, 1, 1, 0, 1),
    g: r(x, y, -3, -0.5, 2, 1, 0.75),
    b: r(x, y, -2, -4, 4, 2, 0.5),
    a: 255
  };
});

const sketch = () => {
  return ({ context, width, height }) => {
    environment.tick();
    const imageData = new ImageData(terrain.data, width, height);
    context.putImageData(imageData, 0, 0);
  };
};

canvasSketch(sketch, settings);
