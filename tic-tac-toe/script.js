const boardElement = document.querySelector('.board');
const statusElement = document.querySelector('#status');
const resetBtn = document.querySelector('#resetBtn');
const scoreXElement = document.querySelector('#scoreX');
const scoreOElement = document.querySelector('#scoreO');
const scoreDElement = document.querySelector('#scoreD');

/** Game state */
let board = Array(9).fill(null); // null | 'X' | 'O'
let currentPlayer = 'X';
let isGameOver = false;
let scores = { X: 0, O: 0, D: 0 };

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function setStatus(message) {
  statusElement.textContent = message;
}

function updateScoreboard() {
  scoreXElement.textContent = String(scores.X);
  scoreOElement.textContent = String(scores.O);
  scoreDElement.textContent = String(scores.D);
}

function checkWinner() {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  if (board.every((cell) => cell)) return { winner: 'D', line: [] }; // Draw
  return null;
}

function renderBoard() {
  boardElement.innerHTML = '';
  boardElement.setAttribute('aria-rowcount', '3');
  boardElement.setAttribute('aria-colcount', '3');

  board.forEach((value, index) => {
    const cell = document.createElement('button');
    cell.className = `cell${value ? ' ' + value.toLowerCase() : ''}`;
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', `Cell ${index + 1}`);
    cell.dataset.index = String(index);
    cell.textContent = value ? value : '';
    cell.addEventListener('click', onCellClick);
    boardElement.appendChild(cell);
  });
}

function disableBoard() {
  boardElement.querySelectorAll('.cell').forEach((cell) => {
    cell.setAttribute('aria-disabled', 'true');
  });
}

function highlightWin(line) {
  const cells = boardElement.querySelectorAll('.cell');
  line.forEach((idx) => cells[idx].classList.add('win'));
}

function onCellClick(event) {
  if (isGameOver) return;
  const index = Number(event.currentTarget.dataset.index);
  if (board[index]) return; // Occupied

  board[index] = currentPlayer;
  renderBoard();

  const result = checkWinner();
  if (result) {
    isGameOver = true;
    if (result.winner === 'D') {
      scores.D += 1;
      setStatus('It\'s a draw!');
    } else {
      scores[result.winner] += 1;
      setStatus(`Player ${result.winner} wins!`);
      highlightWin(result.line);
    }
    updateScoreboard();
    disableBoard();
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  setStatus(`Player ${currentPlayer}'s turn`);
}

function resetGame(hard = false) {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  isGameOver = false;
  if (hard) scores = { X: 0, O: 0, D: 0 };
  renderBoard();
  updateScoreboard();
  setStatus(`Player ${currentPlayer}'s turn`);
}

resetBtn.addEventListener('click', (e) => {
  if (e.shiftKey) {
    resetGame(true); // Shift+Click to reset scores too
  } else {
    resetGame(false);
  }
});

// Initial render
renderBoard();
updateScoreboard();
setStatus(`Player ${currentPlayer}'s turn`);