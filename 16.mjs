import { open } from "node:fs/promises";

const fh = await open(new URL("./08.txt", import.meta.url));

const grid = [];
for await (const line of fh.readLines()) {
  grid.push(Array.from(line, Number));
}

let max = Number.MIN_SAFE_INTEGER;
for (let i = 1; i < grid.length - 1; i++) {
  for (let j = 1; j < grid.length - 1; j++) {
    const treeHeight = grid[i][j];
    let scenicScore = 1;

    let multiplier = 1;
    for (let x = i - 1; x > 0 && grid[x][j] < treeHeight; x--) {
      multiplier++;
    }
    scenicScore *= multiplier;

    multiplier = 1;
    for (let x = i + 1; x < grid.length - 1 && grid[x][j] < treeHeight; x++) {
      multiplier++;
    }
    scenicScore *= multiplier;

    multiplier = 1;
    for (let y = j + 1; y < grid.length - 1 && grid[i][y] < treeHeight; y++) {
      multiplier++;
    }
    scenicScore *= multiplier;

    multiplier = 1;
    for (let y = j - 1; y > 0 && grid[i][y] < treeHeight; y--) {
      multiplier++;
    }
    scenicScore *= multiplier;

    if (scenicScore > max) max = scenicScore;
  }
}

console.log({ max });
