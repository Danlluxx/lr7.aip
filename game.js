const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const rows = 3;
const cols = 3;

let playground = Array.from({ length: rows }, () => Array(cols).fill(null));
let currentPlayer = 'X';

const winningCombinations = [
  [[0, 0], [0, 1], [0, 2]],
  [[1, 0], [1, 1], [1, 2]],
  [[2, 0], [2, 1], [2, 2]],
  [[0, 0], [1, 0], [2, 0]],
  [[0, 1], [1, 1], [2, 1]],
  [[0, 2], [1, 2], [2, 2]],
  [[0, 0], [1, 1], [2, 2]],
  [[0, 2], [1, 1], [2, 0]]
];

function resizeCanvas() {
  if (window.innerWidth < 600) {
    canvas.width = canvas.height = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.9);
  } else {
    canvas.width = canvas.height = 400;
  }
  cellSize = canvas.width / 3;
  drawField();
  drawSymbols();
}

function drawField() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;

  for (let i = 1; i < cols; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, canvas.height);
    ctx.stroke();
  }

  for (let i = 1; i < rows; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(canvas.width, i * cellSize);
    ctx.stroke();
  }
}

function drawSymbols() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (playground[row][col]) {
        drawSymbol(row, col, playground[row][col]);
      }
    }
  }
}

function drawSymbol(row, col, mark) {
  const x = col * cellSize + cellSize / 2;
  const y = row * cellSize + cellSize / 2;
  ctx.font = `${cellSize / 2}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black'; // Цвет символов черный
  ctx.fillText(mark, x, y);
}

function drawWinLine(combination) {
  const [[startRow, startCol], , [endRow, endCol]] = combination;

  const startX = startCol * cellSize + cellSize / 2;
  const startY = startRow * cellSize + cellSize / 2;
  const endX = endCol * cellSize + cellSize / 2;
  const endY = endRow * cellSize + cellSize / 2;

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}

function checkWinner() {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (
      playground[a[0]][a[1]] && // Проверяем на соответствие 1, 2, 3 клетку
      playground[a[0]][a[1]] === playground[b[0]][b[1]] &&
      playground[a[0]][a[1]] === playground[c[0]][c[1]]
    ) {
      return { winner: playground[a[0]][a[1]], combination };
    }
  }
  return null;
}

function isBoardFull() {
  return playground.flat().every(cell => cell !== null);
}

canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect(); // Вычисление позиций клика
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const col = Math.floor(mouseX / cellSize); // Определение по чему кликнули
  const row = Math.floor(mouseY / cellSize);

  if (!playground[row][col]) { // Пустая ли клетка
    playground[row][col] = currentPlayer;
    drawSymbol(row, col, currentPlayer);

    const result = checkWinner();
    if (result) {
      drawWinLine(result.combination);
      setTimeout(() => alert(`Победитель: ${result.winner}`), 10);
      setTimeout(resetGame, 1500);
      return;
    }

    if (isBoardFull()) {
      setTimeout(() => alert('Ничья!'), 10);
      setTimeout(resetGame, 1500);
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }
});

function resetGame() {
  playground = Array.from({ length: rows }, () => Array(cols).fill(null));
  currentPlayer = 'X';
  drawField();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
