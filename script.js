function generateGrid(parentElem, cellsNum) {
   totalCells = cellsNum * cellsNum;
  for (let i = 0; i < totalCells; i++) {
      const cell = document.createElement('div');
      cell.style.backgroundColor = DEFAULT_BACKGROUND_COLOR;
      cell.addEventListener('mousedown', (e) => {
        draw(e.currentTarget);
        isDrawing = true;
      });
      cell.addEventListener('pointerenter', (e) => {
        if (isDrawing === true) {
          draw(e.currentTarget);
        };
      })
      cell.addEventListener('mouseup', () => isDrawing = false);
      cell.addEventListener('dragstart', e => e.preventDefault());
      cell.addEventListener('drop', e => e.preventDefault());
      parentElem.appendChild(cell);
  }
  parentElem.style['grid-template-columns'] = `repeat(${cellsNum}, 1fr)`;
  parentElem.style['grid-template-rows'] = `repeat(${cellsNum}, 1fr)`;
};

function drawNormal(cell) {
  cell.style.backgroundColor = `rgb(0, 0, 0)`;
};

function removeElementsFromParent(parentElem) {
  while (parentElem.firstChild) {
    parentElem.removeChild(parentElem.firstChild);
  };
};

function generateUserDefinedGrid() {
  let newGridSize = 0;
  let num = prompt('Choose number of cells per side (min 16 / max 100):');
  if (num === null) return;
  num = parseInt(num);
  if (num >= 16 && num <= 100) {
    newGridSize = num;
  } else {
    do {
      num = prompt('Invalid size! Number must be between 16 and 100.');
      if (num === null) return;
      num = parseInt(num);
    } while (!Number.isFinite(num) || (num < 16 || num > 100));
    newGridSize = num;
  };  
  removeElementsFromParent(grid);
  generateGrid(grid, newGridSize);
};

function drawRandom(cell) {
  const R = Math.floor(Math.random() * 256);
  const G = Math.floor(Math.random() * 256);
  const B = Math.floor(Math.random() * 256);
  cell.style.backgroundColor = `rgb(${R}, ${G}, ${B})`;
};

function drawShade(cell) {
  const baseRGBValue = parseInt(DEFAULT_BACKGROUND_COLOR.replace(/ /g, '').slice(4, -1).split(',')[0]);
  const decreasePercentage = 10;
  const currentRGBValue = parseInt(cell.style.backgroundColor.replace(/ /g, '').slice(4, -1).split(',')[0]);
  const currentPercentage = Math.round((currentRGBValue/baseRGBValue) * 100);
  const newRGBValue = (baseRGBValue * (currentPercentage - decreasePercentage) / 100);
  cell.style.backgroundColor = `rgb(${newRGBValue}, ${newRGBValue}, ${newRGBValue})`;
};

function clearGrid() {
  const cells = Array.from(grid.children);
  cells.forEach(cell => cell.style.backgroundColor = DEFAULT_BACKGROUND_COLOR);
};

function draw(cell) {
  switch(drawMode) {
    case 'normal':
      drawNormal(cell);
      break;
    case 'random':
      drawRandom(cell);
      break;
    case 'shade':
      drawShade(cell);
      break;
  };
};

const DEFAULT_BACKGROUND_COLOR = 'rgb(255, 255, 255)';
let isDrawing = false;
let drawMode = '';
let initialGrid = 16;
const grid = document.querySelector('.grid');
const modeButtons = document.querySelectorAll('#mode');
const newGridButton = document.querySelector('.new-grid');
const clearButton = document.querySelector('.clear')

generateGrid(grid, initialGrid);

modeButtons.forEach((button, i, buttons) => button.addEventListener('click', (e) => {
  drawMode = e.currentTarget.classList[0];
  buttons.forEach((button => {
    button.classList.toggle('active', button === e.currentTarget);
  }));
}));

newGridButton.addEventListener('click', generateUserDefinedGrid);
clearButton.addEventListener('click', clearGrid);
