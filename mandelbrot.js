const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [2048, 2048]
};

function mandelbrot(cx, cy, maxIters) {
  if (testBulb(cx, cy) || testCardioid(cx, cy)) return maxIters;
  let i,
    xs = cx * cx,
    ys = cy * cy,
    x = cx,
    y = cy;
  for (i = 0; i < maxIters && xs + ys < 4; i++) {
    let x0 = x;
    x = xs - ys + cx;
    y = 2 * x0 * y + cy;
    xs = x * x;
    ys = y * y;
  }
  return i;
}

function testCardioid(x, y) {
  const a = x - 1 / 4;
  const q = a * a + y * y;
  return q * (q + a) <= 0.25 * y * y;
}

function testBulb(x, y) {
  const a = x + 1;
  return a * a + y * y <= 1 / 16;
}

const sketch = () => {
  return ({ context, width, height }) => {
    const real = p => (4 / width) * (p - width / 1.5);
    const imaginary = p => (4 / height) * (p - height / 2);

    for (let x = 0; x < width; x++) {
      const r = real(x);
      for (let y = 0; y < height; y++) {
        const i = imaginary(y);
        const m = mandelbrot(r, i, 16);
        context.fillStyle = `rgb(${m * 16}, ${m * 16}, ${m * 16})`;
        context.fillRect(x, y, 1, 1);
      }
    }
  };
};

canvasSketch(sketch, settings);
