import { open } from "node:fs/promises";

const fh = await open(new URL("./08.txt", import.meta.url));

const grid = [];
for await (const line of fh.readLines()) {
  grid.push(Array.from(line, Number));
}

// let visibleTrees = grid.length * grid.length - (grid.length - 2) ** 2;
let visibleTrees = 4 * grid.length - 4;
for (let i = 1; i < grid.length - 1; i++) {
  for (let j = 1; j < grid.length - 1; j++) {
    const treeHeight = grid[i][j];
    if (
      grid[i].every((height, y) => j <= y || height < treeHeight) ||
      grid[i].every((height, y) => j >= y || height < treeHeight) ||
      grid.every((line, x) => i <= x || line[j] < treeHeight) ||
      grid.every((line, x) => i >= x || line[j] < treeHeight)
    ) {
      visibleTrees++;
    }
  }
}

console.log({ visibleTrees });
