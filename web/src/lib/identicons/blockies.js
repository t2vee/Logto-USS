// https://github.com/ethereum/blockies/blob/master/blockies.js
// modified for esm by t2vee

let randseed = new Array(4); // Xorshift: [x, y, z, w] 32 bit values

export function seedrand(seed) {
  for (let i = 0; i < randseed.length; i++) {
    randseed[i] = 0;
  }
  for (let i = 0; i < seed.length; i++) {
    randseed[i % 4] = ((randseed[i % 4] << 5) - randseed[i % 4]) + seed.charCodeAt(i);
  }
}

function rand() {
  // based on Java's String.hashCode(), expanded to 4 32bit values
  let t = randseed[0] ^ (randseed[0] << 11);

  randseed[0] = randseed[1];
  randseed[1] = randseed[2];
  randseed[2] = randseed[3];
  randseed[3] = (randseed[3] ^ (randseed[3] >> 19) ^ t ^ (t >> 8));

  return (randseed[3] >>> 0) / ((1 << 31) >>> 0);
}

function createColor() {
  //saturation is the whole color spectrum
  let h = Math.floor(rand() * 360);
  //saturation goes from 40 to 100, it avoids greyish colors
  let s = ((rand() * 60) + 40) + '%';
  //lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
  let l = ((rand() + rand() + rand() + rand()) * 25) + '%';

  let color = 'hsl(' + h + ',' + s + ',' + l + ')';
  return color;
}

function createImageData(size) {
  let width = size; // Only support square icons for now
  let height = size;

  let dataWidth = Math.ceil(width / 2);
  let mirrorWidth = width - dataWidth;

  let data = [];
  for (let y = 0; y < height; y++) {
    let row = [];
    for (let x = 0; x < dataWidth; x++) {
      // this makes foreground and background color to have a 43% (1/2.3) probability
      // spot color has 13% chance
      row[x] = Math.floor(rand() * 2.3);
    }
    let r = row.slice(0, mirrorWidth);
    r.reverse();
    row = row.concat(r);

    for (let i = 0; i < row.length; i++) {
      data.push(row[i]);
    }
  }

  return data;
}

function buildOpts(opts) {
  let newOpts = {};

  newOpts.seed = opts.seed || Math.floor((Math.random() * Math.pow(10, 16))).toString(16);

  seedrand(newOpts.seed);

  newOpts.size = opts.size || 8;
  newOpts.scale = opts.scale || 4;
  newOpts.color = opts.color || createColor();
  newOpts.bgcolor = opts.bgcolor || createColor();
  newOpts.spotcolor = opts.spotcolor || createColor();

  return newOpts;
}

function renderIcon(opts, canvas) {
  opts = buildOpts(opts || {});
  let imageData = createImageData(opts.size);
  let width = Math.sqrt(imageData.length);

  canvas.width = canvas.height = opts.size * opts.scale;

  let cc = canvas.getContext('2d');
  cc.fillStyle = opts.bgcolor;
  cc.fillRect(0, 0, canvas.width, canvas.height);
  cc.fillStyle = opts.color;

  for (let i = 0; i < imageData.length; i++) {

    // if data is 0, leave the background
    if (imageData[i]) {
      let row = Math.floor(i / width);
      let col = i % width;

      // if data is 2, choose spot color, if 1 choose foreground
      cc.fillStyle = (imageData[i] === 1) ? opts.color : opts.spotcolor;

      cc.fillRect(col * opts.scale, row * opts.scale, opts.scale, opts.scale);
    }
  }
  return canvas;
}

function createIcon(opts) {
  let canvas = document.createElement('canvas');

  renderIcon(opts, canvas);

  return canvas;
}

const api = {
  create: createIcon,
  render: renderIcon
};

export default api;  // Set 'api' as the default export for this module
