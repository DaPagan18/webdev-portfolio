// Orchestrates the two-player game

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
  endTurnBtn.disabled = true;

  updateLabels();
  setStatus("Player 1's turn: attack Player 2's board (left).");
  enableCurrentAttackBoard();

  overlayEl.classList.add("hidden");
}

function updateLabels() {
  if (currentPlayer === 1) {
    leftLabelEl.textContent = "Player 2's Board (Target)";
    rightLabelEl.textContent = "Player 1's Board (Your View)";
  } else {
    leftLabelEl.textContent = "Player 2's Board (Your View)";
    rightLabelEl.textContent = "Player 1's Board (Target)";
  }
}

function enableCurrentAttackBoard() {
  if (currentPlayer === 1) {
    enableBoard(leftTiles);
    disableBoard(rightTiles);
  } else {
    enableBoard(rightTiles);
    disableBoard(leftTiles);
  }
}

function onLeftTileClick(x, y, tileEl) {
  if (gameOver) return;
  if (currentPlayer !== 1) return; // left is target only for P1
  if (tileEl.classList.contains("disabled")) return;

  handleShot(player2Board, leftTiles, x, y, tileEl, "Player 1", "Player 2");
}

function onRightTileClick(x, y, tileEl) {
  if (gameOver) return;
  if (currentPlayer !== 2) return; // right is target only for P2
  if (tileEl.classList.contains("disabled")) return;

  handleShot(player1Board, rightTiles, x, y, tileEl, "Player 2", "Player 1");
}

function handleShot(targetBoard, tilesMatrix, x, y, tileEl, attackerName, defenderName) {
  const result = targetBoard.receiveShot(x, y);

  if (result.already) {
    return;
  }

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

  if (targetBoard.allCreaturesDefeated()) {
    gameOver = true;
    endTurnBtn.disabled = true;
    setStatus(`${attackerName} wins! All of ${defenderName}'s creatures are defeated.`);
    disableBoard(leftTiles);
    disableBoard(rightTiles);
    return;
  }

  // allow ending turn after a valid shot
  endTurnBtn.disabled = false;
}

endTurnBtn.addEventListener("click", () => {
  if (gameOver) return;
  endTurnBtn.disabled = true;

  const prevPlayer = currentPlayer;
  currentPlayer = currentPlayer === 1 ? 2 : 1;

  showOverlay(`Player ${prevPlayer}'s turn is over.\nPass the device to Player ${currentPlayer}.`);
});

overlayContinueBtn.addEventListener("click", () => {
  hideOverlay();
  updateLabels();
  enableCurrentAttackBoard();
  setStatus(
    currentPlayer === 1
      ? "Player 1's turn: attack Player 2's board (left)."
      : "Player 2's turn: attack Player 1's board (right)."
  );
});

// start game on load
window.addEventListener("DOMContentLoaded", initGame);