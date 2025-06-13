let sticks = [];
let colorBoxes = [];
let lives = 3;
let gameOver = false;

// szinek
const colors = [
  '#FF0000', // piros
  '#00FF00', // zold
  '#0000FF', // kek
  '#FFFF00', // sarga
  '#FF00FF', // magenta
  '#00FFFF', // cian
  '#FFA500', // narancs
  '#800080', // lila
  '#008000', // sotetzold
  '#FFC0CB', // rozsaszin
];

// minden palcika ugyan azon a teruleten lesz de kicsit eltolva
const baseStickCoords = [150, 150, 250, 250]; // [x1, y1, x2, y2]

const canvas = document.getElementById('stickCanvas');
const ctx = canvas.getContext('2d');
const colorSelector = document.getElementById('colorSelector');
const statusMessage = document.getElementById('statusMessage');
const livesDisplay = document.getElementById('livesDisplay');
const restartButton = document.getElementById('restartBtn');

// canvas kirajzolasa
function drawGame() {
  // toroljuk a meglevot
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // rendezzuk a palcikakat z-index szerint - kisebb z-index alul, nagyobb felul
  const sortedSticks = [...sticks].sort((a, b) => a.zIndex - b.zIndex);

  // kirajzoljuk a palcikakat
  for (const stick of sortedSticks) {
    const [x1, y1, x2, y2] = stick.coords;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 8;
    ctx.strokeStyle = stick.color;
    ctx.stroke();
  }
}

function updateLives() {
  livesDisplay.textContent = `Életek: ${'❤️'.repeat(lives)}`;
}

function linesOverlap(coords1, coords2) {
  const [x1, y1, x2, y2] = coords1;
  const [x3, y3, x4, y4] = coords2;

  function ccw(ax, ay, bx, by, cx, cy) {
    return (cy - ay) * (bx - ax) > (by - ay) * (cx - ax);
  }

  return (
    ccw(x1, y1, x3, y3, x4, y4) !== ccw(x2, y2, x3, y3, x4, y4) &&
    ccw(x1, y1, x2, y2, x3, y3) !== ccw(x1, y1, x2, y2, x4, y4)
  );
}

// ha rakkatintunk egy szinre
function handleColorClick(event) {
  if (gameOver || sticks.length === 0) return;

  const selectedColor = event.target.dataset.color;

  // megkeressuk az osszes ilyen szinu palcikat
  const candidates = sticks.filter((stick) => stick.color === selectedColor);

  for (const stick of candidates) {
    // van-e felette masik palcika
    const hasStickAbove = sticks.some(
      (other) => other.zIndex > stick.zIndex && linesOverlap(stick.coords, other.coords),
    );

    if (!hasStickAbove) {
      // ha nincs akkor eltavolithato
      sticks = sticks.filter((s) => s !== stick);
      statusMessage.textContent = 'Helyes! Jó pálcikát választottál.';

      if (sticks.length === 0) {
        statusMessage.textContent = 'Gratulálok! Minden pálcikát eltávolítottál!';
        gameOver = true;
      }

      drawGame();
      return;
    }
  }

  // ha nem sikerult eltavolitani egyet
  lives--;
  updateLives();
  statusMessage.textContent = 'Helytelen! Keress olyan pálcikát, amely nincs lefedve!';

  if (lives <= 0) {
    statusMessage.textContent = 'Játék vége! Elfogytak az életeid.';
    gameOver = true;
  }

  drawGame();
}

// osszekeverjuk a palcikak szineit
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function initGame() {
  sticks = [];
  colorBoxes = [];
  lives = 3;
  gameOver = false;

  // osszekeverjuk a szineket
  const shuffledColors = [...colors];
  shuffleArray(shuffledColors);

  // letrehozzuk a palcikakat kicsit eltavolitva egymastol
  for (let i = 0; i < 10; i++) {
    const offsetX = -60 + Math.random() * 120;
    const offsetY = -20 + i * 8 + Math.random() * 10;
    const offsetX2 = -60 + Math.random() * 120;
    const offsetY2 = -20 + i * 8 + Math.random() * 10;

    sticks.push({
      coords: [
        baseStickCoords[0] + offsetX,
        baseStickCoords[1] + offsetY,
        baseStickCoords[2] + offsetX2,
        baseStickCoords[3] + offsetY2,
      ],
      color: shuffledColors[i],
      zIndex: i,
    });
  }

  // letrehozzuk a szinvalasztokat
  colorSelector.innerHTML = '';
  for (let i = 0; i < colors.length; i++) {
    const colorBox = document.createElement('div');
    colorBox.className = 'color-box';
    colorBox.style.backgroundColor = colors[i];
    colorBox.dataset.color = colors[i];
    colorBox.addEventListener('click', handleColorClick);
    colorSelector.appendChild(colorBox);
    colorBoxes.push(colorBox);
  }

  updateLives();

  statusMessage.textContent = 'Válaszd ki a legfelső pálcika színét!';

  drawGame();
}

restartButton.addEventListener('click', initGame);

document.addEventListener('DOMContentLoaded', initGame);
