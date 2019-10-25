const canvasSketch = require("canvas-sketch");

const width = 2048;
const height = 0.75 * 2048;
const tileSize = width / 256;

const settings = {
  animate: true,
  dimensions: [width, height]
};

const video = document.createElement("video");

(function init() {
  window.navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: {
        facing: "user"
      }
    })
    .then(s => {
      video.srcObject = s;
      video.play();
    })
    .catch(err => console.log("There was an error 😱", err));
})();

const bufferCanvas = document.createElement("canvas");
bufferCanvas.width = width;
bufferCanvas.height = height;
const bufferContext = bufferCanvas.getContext("2d");
bufferContext.imageSmoothingEnabled = false;
bufferContext.fillStyle = "gray";
bufferContext.fillRect(0, 0, width, height);

function getPixel(imageData, x, y) {
  const start = (y * width + x) * 4;
  return [
    imageData[start],
    imageData[start + 1],
    imageData[start + 2],
    imageData[start + 3]
  ];
}

function coerce(n) {
  return Math.round(n / 32) * 32;
}

function rgb([r, g, b]) {
  return `rgb(${coerce(r)}, ${coerce(g)}, ${coerce(b)})`;
}

function remap(x, aMin, aMax, bMin, bMax) {
  return bMin + ((bMax - bMin) * (x - aMin)) / (aMax - aMin);
}

const sketch = () => {
  return ({ context, width, height, time }) => {
    bufferContext.drawImage(video, 0, 0, width, height);

    const bufferData = bufferContext.getImageData(0, 0, width, height).data;

    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    context.lineCap = "round";

    for (let y = 0; y < height; y += tileSize) {
      for (let x = 0; x < width; x += tileSize) {
        // const pixel = getPixel(
        //   bufferData,
        //   Math.round(x / tileSize) * tileSize,
        //   Math.round(y / tileSize) * tileSize
        // );
        // context.fillStyle = rgb(pixel);
        // context.fillRect(x, y, tileSize, tileSize);
        // const [lastR, lastG, lastB] = getPixel(bufferData, x - tileSize / 2, y);
        // const [r, g, b] = getPixel(bufferData, x + tileSize / 2, y);
        // context.beginPath();
        // context.lineWidth = Math.round(
        //   remap(r + g + b, 0, 255 * 3, tileSize, 0)
        // );
        // const lastYDelta = remap(lastG, 0, 255, -tileSize, tileSize);
        // const newYDelta = remap(g, 0, 255, -tileSize, tileSize);
        // context.moveTo(x, y);
        // context.lineTo(x + tileSize, y);
        // context.stroke();
      }
    }

    for (let y = 0; y < height; y += tileSize) {
      for (let x = 0; x < width; x += tileSize) {
        const [r, g, b] = getPixel(bufferData, x + tileSize / 2, y);
        context.beginPath();
        context.lineWidth = remap(r, 0, 255, tileSize, 0);
        context.moveTo(x, y);
        context.lineTo(x, y + tileSize);
        context.stroke();
      }
    }
  };
};

canvasSketch(sketch, settings);
