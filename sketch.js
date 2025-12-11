let bg, SCENE_W, SCENE_H;

//Variables
let persons = [];
let hats = [];
let glasses = [];
let shirts = [];
let sweaters = [];
let jeans = [];
let shoes = [];

// índices: -1 = oculto (empieza sin ropa)
let iPerson = 0;
let iHat = -1;
let iGlasses = -1;
let iShirt = -1;
let iSweater = -1;
let iJeans = -1;
let iShoe = -1;

let factorModel = 0.85;
let offsetX = 45;
let offsetY = 60;

function preload() {
  bg = loadImage("IMG_8036.JPG", (img) => {
    SCENE_W = img.width;
    SCENE_H = img.height;
  });

  persons = loadBatch("person", 1, 3, "PNG");
  hats = loadBatch("gorro", 1, 3, "PNG");
  glasses = loadBatch("lentes", 1, 3, "PNG");
  shirts = loadBatch("shirt", 1, 7, "PNG");
  sweaters = loadBatch("sueter", 2, 5, "PNG");
  jeans = loadBatch("jeans", 1, 5, "PNG");
  shoes = loadBatch("shoe", 1, 4, "PNG");
}

function setup() {
  createCanvas(700, 900);
  imageMode(CORNER);
  iPerson = floor(random(persons.length));
  iHat = iGlasses = iShirt = iSweater = iJeans = iShoe = -1;
}

function draw() {
  clear();

  let IW = SCENE_W || (bg ? bg.width : width);
  let IH = SCENE_H || (bg ? bg.height : height);

  let scale = Math.min(width / IW, height / IH);
  let drawW = IW * scale;
  let drawH = IH * scale;
  let ox = (width - drawW) / 2;
  let oy = (height - drawH) / 2;

  if (bg) image(bg, ox, oy, drawW, drawH);

  let drawOnModel = (img, dx = 0, dy = 0, scaleMul = 1) => {
    if (!img) return;
    image(
      img,
      ox + offsetX + dx,
      oy + offsetY + dy,
      drawW * factorModel * scaleMul,
      drawH * factorModel * scaleMul
    );
  };

  if (iPerson >= 0) drawOnModel(persons[iPerson]);
  if (iShoe >= 0) drawOnModel(shoes[iShoe]);
  if (iJeans >= 0) drawOnModel(jeans[iJeans]);
  if (iShirt >= 0) drawOnModel(shirts[iShirt]);
  if (iSweater >= 0) drawOnModel(sweaters[iSweater]);
  if (iGlasses >= 0) drawOnModel(glasses[iGlasses]);
  if (iHat >= 0) drawOnModel(hats[iHat]);
}

function keyPressed() {
  if (key === " ") {
    saveCanvas("outfit", "png");
    return;
  }

  if (keyCode === UP_ARROW) {
    iHat = next(iHat, hats.length, +1);
    cat("hats");
    return;
  }
  if (key === "w" || key === "W") {
    iGlasses = next(iGlasses, glasses.length, +1);
    cat("glasses");
    return;
  }
  if (keyCode === DOWN_ARROW) {
    iJeans = next(iJeans, jeans.length, +1);
    cat("jeans");
    return;
  }
  if (keyCode === LEFT_ARROW) {
    iShirt = next(iShirt, shirts.length, +1);
    cat("shirts");
    return;
  }
  if (keyCode === RIGHT_ARROW) {
    iSweater = next(iSweater, sweaters.length, +1);
    cat("sweaters");
    return;
  }
  if (key === "s" || key === "S") {
    iShoe = next(iShoe, shoes.length, +1);
    cat("shoes");
    return;
  }

  if (key === "r" || key === "R") {
    iPerson = floor(random(persons.length));
    iHat = iGlasses = iShirt = iSweater = iJeans = iShoe = -1;
    cat("persons");
    return;
  }

  let step = keyIsDown(SHIFT) ? 10 : 2; // mover
  let sstep = keyIsDown(SHIFT) ? 0.1 : 0.02; // escala

  // Mover con IJKL
  if (key === "j" || key === "J") {
    edit(-step, 0, 0);
    return;
  }
  if (key === "l" || key === "L") {
    edit(step, 0, 0);
    return;
  }
  if (key === "i" || key === "I") {
    edit(0, -step, 0);
    return;
  }
  if (key === "k" || key === "K") {
    edit(0, step, 0);
    return;
  }

  // Escalar con - y =/+
  if (key === "-" || key === "_") {
    edit(0, 0, -sstep);
    return;
  }
  if (key === "=" || key === "+") {
    edit(0, 0, +sstep);
    return;
  }

  // Reset del item actual
  if (key === "x" || key === "X") {
    resetCurrent();
    return;
  }

  if (key === "p" || key === "P") {
    saveOffsets();
    return;
  }
}

function loadBatch(prefix, from, to, ext) {
  let arr = [];
  for (let i = from; i <= to; i++) {
    arr.push(loadImage(`${prefix}${i}.${ext}`));
  }
  return arr;
}

function next(i, n, step) {
  if (n <= 0) return -1;
  if (i < 0) return 0;
  let k = i + step;
  while (k < 0) k += n;
  while (k >= n) k -= n;
  return k;
}
