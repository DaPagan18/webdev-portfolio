class Board {
  constructor(size = 10) {
    this.size = size;
    this.grid = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => ({
        creature: null, // reference to creature instance
        hit: false
      }))
    );
    this.creatureInstances = []; // { creatureDef, tiles: [{x,y}], hits: number }
  }

  inBounds(x, y) {
    return x >= 0 && x < this.size && y >= 0 && y < this.size;
  }

  canPlaceShapeAt(shape, originX, originY) {
    for (const { dx, dy } of shape) {
      const x = originX + dx;
      const y = originY + dy;
      if (!this.inBounds(x, y)) return false;
      if (this.grid[x][y].creature !== null) return false;
    }
    return true;
  }

  placeShape(creatureDef, shape, originX, originY) {
    const tiles = [];
    for (const { dx, dy } of shape) {
      const x = originX + dx;
      const y = originY + dy;
      this.grid[x][y].creature = creatureDef;
      tiles.push({ x, y });
    }
    this.creatureInstances.push({
      def: creatureDef,
      tiles,
      hits: 0,
      defeated: false
    });
  }

  autoPlaceAllCreatures() {
    const maxAttempts = 100;

    for (const creatureDef of CREATURES) {
      const shapes = creatureDef.shapes;
      let placed = false;

      for (let attempts = 0; attempts < maxAttempts && !placed; attempts++) {
        const shape = shapes[Math.floor(Math.random() * shapes.length)];

        // find bounding box to limit origin
        let minDx = Infinity, maxDx = -Infinity, minDy = Infinity, maxDy = -Infinity;
        for (const { dx, dy } of shape) {
          if (dx < minDx) minDx = dx;
          if (dx > maxDx) maxDx = dx;
          if (dy < minDy) minDy = dy;
          if (dy > maxDy) maxDy = dy;
        }

        const width = maxDx - minDx + 1;
        const height = maxDy - minDy + 1;

        const originX = Math.floor(Math.random() * (this.size - width + 1)) - minDx;
        const originY = Math.floor(Math.random() * (this.size - height + 1)) - minDy;

        if (this.canPlaceShapeAt(shape, originX, originY)) {
          this.placeShape(creatureDef, shape, originX, originY);
          placed = true;
        }
      }

      if (!placed) {
        console.warn("Failed to place creature:", creatureDef.name);
      }
    }
  }

  receiveShot(x, y) {
    const cell = this.grid[x][y];
    if (cell.hit) {
      return { already: true };
    }
    cell.hit = true;

    if (cell.creature === null) {
      return { hit: false, miss: true };
    }

    // find creature instance and update hits
    const instance = this.creatureInstances.find(ci => ci.def === cell.creature && ci.tiles.some(t => t.x === x && t.y === y));
    if (!instance) {
      return { hit: true, defeated: false, creature: cell.creature };
    }

    instance.hits++;
    let defeated = false;
    if (!instance.defeated && instance.hits >= instance.tiles.length) {
      instance.defeated = true;
      defeated = true;
    }

    return {
      hit: true,
      defeated,
      creature: cell.creature,
      instance
    };
  }

  allCreaturesDefeated() {
    return this.creatureInstances.every(ci => ci.defeated);
  }
}