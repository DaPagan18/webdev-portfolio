const leftBoardEl = document.getElementById("left-board");
const rightBoardEl = document.getElementById("right-board");
const statusEl = document.getElementById("status");

const leftLabelEl = document.getElementById("left-board-label");
const rightLabelEl = document.getElementById("right-board-label");

function createBoardDOM(boardEl, onTileClick) {
  boardEl.innerHTML = "";
  const tiles = [];

  for (let x = 0; x < 10; x++) {
    tiles[x] = [];
    for (let y = 0; y < 10; y++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.dataset.x = x;
      tile.dataset.y = y;
      tile.addEventListener("click", () => onTileClick(x, y, tile));
      boardEl.appendChild(tile);
      tiles[x][y] = tile;
    }
  }

  return tiles;
}

function setStatus(text) {
  statusEl.textContent = text;
}

function showOverlay(text) {
  document.getElementById("turnModalText").textContent = text;
  const modal = new bootstrap.Modal(document.getElementById("turnModal"));
  modal.show();
}

function hideOverlay() {
  const modal = bootstrap.Modal.getInstance(document.getElementById("turnModal"));
  modal.hide();
}

function markMiss(tileEl) {
  tileEl.classList.add("miss", "disabled");
  tileEl.textContent = "•";
}

function markHit(tileEl, icon) {
  tileEl.classList.add("hit", "disabled");
  tileEl.textContent = icon;
}

function markDefeated(board, tilesMatrix, instance) {
  for (const { x, y } of instance.tiles) {
    const tileEl = tilesMatrix[x][y];
    tileEl.classList.add("defeated");
  }
}

function disableBoard(tilesMatrix) {
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      tilesMatrix[x][y].classList.add("disabled");
    }
  }
}

function enableBoard(tilesMatrix) {
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      tilesMatrix[x][y].classList.remove("disabled");
    }
  }
}