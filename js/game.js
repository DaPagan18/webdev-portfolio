let p1Score = 0;
let p2Score = 0;

let player1Board, player2Board;
let leftTiles, rightTiles;
let currentPlayer = 1;
let gameOver = false;

function initGame() {
  player1Board = new Board(10);
  player2Board = new Board(10);

  player1Board.autoPlaceAllCreatures();
  player2Board.autoPlaceAllCreatures();

  leftTiles = createBoardDOM(leftBoardEl, onLeftTileClick);
  rightTiles = createBoardDOM(rightBoardEl, onRightTileClick);

  currentPlayer = 1;
  gameOver = false;

  p1Score = 0;
  p2Score = 0;
  updateScoreboard();

  updateLabels();
  setStatus("Player 1's turn: explore Player 2's board (left).");
  enableCurrentAttackBoard();
}

function updateScoreboard() {
  document.getElementById("p1-score").textContent = p1Score;
  document.getElementById("p2-score").textContent = p2Score;
}

function updateLabels() {
  if (currentPlayer === 1) {
    leftLabelEl.textContent = "Player 2's Board (Target)";
    rightLabelEl.textContent = "Player 1's Board (Your Board)";
  } else {
    leftLabelEl.textContent = "Player 2's Board (Your Board)";
    rightLabelEl.textContent = "Player 1's Board (Target)";
  }
}

function enableCurrentAttackBoard() {
  const leftWrapper = document.getElementById("left-wrapper");
  const rightWrapper = document.getElementById("right-wrapper");

  if (currentPlayer === 1) {
    enableBoard(leftTiles);
    disableBoard(rightTiles);

    // Show only the left board on small/medium screens
    leftWrapper.classList.remove("hide-sm-md");
    rightWrapper.classList.add("hide-sm-md");

  } else {
    enableBoard(rightTiles);
    disableBoard(leftTiles);

    // Show only the right board on small/medium screens
    rightWrapper.classList.remove("hide-sm-md");
    leftWrapper.classList.add("hide-sm-md");
  }
}

function onLeftTileClick(x, y, tileEl) {
  if (gameOver) return;
  if (currentPlayer !== 1) return;
  if (tileEl.classList.contains("disabled")) return;

  handleShot(player2Board, leftTiles, x, y, tileEl, "Player 1", "Player 2");
}

function onRightTileClick(x, y, tileEl) {
  if (gameOver) return;
  if (currentPlayer !== 2) return;
  if (tileEl.classList.contains("disabled")) return;

  handleShot(player1Board, rightTiles, x, y, tileEl, "Player 2", "Player 1");
}

function handleShot(targetBoard, tilesMatrix, x, y, tileEl, attackerName, defenderName) {
  const result = targetBoard.receiveShot(x, y);

  if (result.already) return;

  if (result.miss) {
    markMiss(tileEl);
    setStatus(`${attackerName} missed.`);
  } else if (result.hit) {
    markHit(tileEl, result.creature.icon);
    let msg = `${attackerName} hit a ${result.creature.icon} ${result.creature.name}!`;

    if (result.defeated) {
      markDefeated(targetBoard, tilesMatrix, result.instance);
      msg += ` ${defenderName}'s ${result.creature.name} is defeated!`;
    }

    setStatus(msg);
  }

    if (currentPlayer === 1) {
    if (result.hit) p1Score += 1;
    if (result.defeated) p1Score += 5;
  } else {
    if (result.hit) p2Score += 1;
    if (result.defeated) p2Score += 5;
  }

  updateScoreboard();

  // --- Win check ---
  if (targetBoard.allCreaturesDefeated()) {
    gameOver = true;
    setStatus(`${attackerName} wins! Final Score — Player 1: ${p1Score}, Player 2: ${p2Score}`);
    disableBoard(leftTiles);
    disableBoard(rightTiles);
    return;
  }

  // --- Auto-switch turns ---
  const prevPlayer = currentPlayer;
  currentPlayer = currentPlayer === 1 ? 2 : 1;

  showOverlay(
    `Player ${prevPlayer}'s turn is over.\nPass the device to Player ${currentPlayer}.`
  );
}

// Continue button inside Bootstrap modal
document.addEventListener("DOMContentLoaded", () => {
  const turnModal = document.getElementById("turnModal");

  turnModal.addEventListener("hidden.bs.modal", () => {
    updateLabels();
    enableCurrentAttackBoard();
    setStatus(
      currentPlayer === 1
        ? "Player 1's turn: explore Player 2's board (left)."
        : "Player 2's turn: explore Player 1's board (right)."
    );
  });
});

// Menu buttons
document.getElementById("new-game-btn").addEventListener("click", () => {
  if (confirm("Start a new game? Current progress will be lost.")) {
    initGame();
  }
});

document.getElementById("confirm-exit-btn").addEventListener("click", () => {
  window.location.href = "index.html";
});

// Start game on load
window.addEventListener("DOMContentLoaded", initGame);