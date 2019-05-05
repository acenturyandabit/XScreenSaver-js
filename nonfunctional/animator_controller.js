//RNG.
var preseed;

function srand(newPreseed) {
  if (newPreseed.length) { //process strings as well
    let k = 0;
    for (i in newPreseed) {
      k += newPreseed.charCodeAt(i)
    }
    newPreseed = k;
  }
  preseed = newPreseed;
}

function rand() { // returns a rather large integer.
  return preseed = preseed * 16807 % 2147483647;
}

function randCol() {
  return [rand() % 255, rand() % 255, rand() % 255];
}

function mush(_imdata, x, y, col) {
  _imdata.data[(x * _imdata.height + y) * 4] = col[0];
  _imdata.data[(x * _imdata.height + y) * 4 + 1] = col[1];
  _imdata.data[(x * _imdata.height + y) * 4 + 2] = col[2];
  _imdata.data[(x * _imdata.height + y) * 4 + 3] = 255;
}

// internal rng: generates a random 15x15 pixel set.
var sampleSize = 20;
var squareSize = 300;
var imdata;
var ctx;

function internalGen() {
  let intlCol = randCol();
  for (i = 0; i < sampleSize; i++) {
    for (j = 0; j < sampleSize; j++) {
      if (rand() % 2) mush(imdata, (squareSize - sampleSize) / 2 + i, (squareSize - sampleSize) / 2 + j, intlCol); //(w+h)*4
      //output[i].push((rand() % 2)?intlCol:[0,0,0]);
    }
  }
}

function sectionSeed(_imdata) {
  let result = 0;
  let _i;
  let innerMax = 2147483647;
  for (i = 0; i < sampleSize; i++) {
    for (j = 0; j < sampleSize; j++) {
      _i = (((squareSize - sampleSize) / 2 + i) * _imdata.height + (squareSize - sampleSize) / 2 + j) * 4;
      result += _imdata.data[i];
      result += _imdata.data[i + 1];
      result += _imdata.data[i + 2];
      //output[i].push((rand() % 2)?intlCol:[0,0,0]);
    }
  }
  srand(result % innerMax);
}

//sets of generators. Seed with the 15x15 pixel set, generate a frameset.
//Frameset: either a number (set pixel x to y;) or a flip command.

var generators = [
  function(reset) { // circle one
    if (reset) {
      this.r = 0;
      ctx.strokeStyle = "rgba(" + randCol().join(",") + ",1)"
    }
    this.r += rand() % 5 + 1;
    ctx.beginPath();
    ctx.arc(squareSize / 2, squareSize / 2, this.r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
    if (this.r > squareSize * 0.71) return 1;
  },
  function(reset) { // collapse
    if (reset) {
      this.sf = 1;
      this._sf = 0.9;
    }
    ctx.save();

    ctx.fillStyle = "#000000";
    ctx.scale(this._sf, this._sf)
    ctx.drawImage($("canvas")[0], (1 - this._sf) * (squareSize+sampleSize*2) / 2, (1 - this._sf) * (squareSize+sampleSize*2) / 2);
    this.sf *= this._sf;
    ctx.restore();
    if (this.sf < sampleSize / squareSize) {
      return 1;
    }
  },
  function(reset) { // collapse
    if (reset) {
      this.sf = 1;
      this._sf = 0.9;
    }
    ctx.save();

    ctx.fillStyle = "#000000";
    ctx.scale(this._sf, this._sf)
    ctx.drawImage($("canvas")[0], (1 - this._sf) * (squareSize+sampleSize*2) / 2, (1 - this._sf) * (squareSize+sampleSize*2) / 2);
    this.sf *= this._sf;
    ctx.restore();
    if (this.sf < sampleSize / squareSize) {
      return 1;
    }
  },
  function(reset) { // shuffle
    if (reset) {
      this.ct = 0;
    }
    this.x=rand()%Math.floor(squareSize/sampleSize)*sampleSize;
    this.y=rand()%Math.floor(squareSize/sampleSize)*sampleSize;
    this.x2=rand()%Math.floor(squareSize/sampleSize)*sampleSize;
    this.y2=rand()%Math.floor(squareSize/sampleSize)*sampleSize;
    ctx.drawImage($("canvas")[0], this.x,this.y,sampleSize,sampleSize,this.x2,this.y2,sampleSize,sampleSize);
    this.ct++;
    if (!(rand()%55)) {
      return 1;
    }
  },
  function(reset) { // invert
    if (reset) {
      this.ct = 0;
    }
    this.x=rand()%Math.floor(squareSize/sampleSize)*sampleSize;
    this.y=rand()%Math.floor(squareSize/sampleSize)*sampleSize;
    imdata = ctx.getImageData(this.x, this.y, sampleSize, sampleSize);
    for (i=0;i<imdata.data.length;i++)if ((i+1)%4){imdata.data[i]=255-imdata.data[i]}
    ctx.putImageData(imdata,this.x,this.y)
    this.ct++;
    if (!(rand()%55)) {
      return 1;
    }
  },
  function(reset) { // sweep
    if (reset) {
      this.ct = 0;
    }
    
    if (!(rand()%55)) {
      return 1;
    }
  },
];



$(document).ready(() => {
  srand(Date.now());
  ctx = $("canvas")[0].getContext("2d");
  imdata = ctx.getImageData(0, 0, squareSize, squareSize);
  internalGen(); //sampleSize x sampleSize bools.
  ctx.putImageData(imdata, 0, 0);
  setInterval(draw, 100);
})


var state = 0;
var count = 0;
var seedset = [];
var generator = 0;
/*
0: initialise draw
1: main draw cycle
2: selection cycle
*/
function draw() {

  switch (state) {
    case 0:
      //imdata = ctx.getImageData(0, 0, squareSize, squareSize);
      //sectionSeed(imdata);
      //pick a generator
      generator = rand() % generators.length;
      generators[generator](1);
      state = 1;
      break;
    case 1:
      if (generators[generator]() == 1) {
        state = 0;
      }
      break;
  }
}
