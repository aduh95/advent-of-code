import { open } from "node:fs/promises";

const ROCK = Symbol("#");
const SAND = Symbol("o");

const fh = await open(new URL("./14.txt", import.meta.url));

const source = { x: 500, y: 0 };
const grid = [];
for await (const line of fh.readLines()) {
  const paths = line.split(" -> ").map((coord) => coord.split(",", 2));

  for (let i = 1; i < paths.length; i++) {
    if (paths[i - 1][0] === paths[i][0]) {
      const start = Math.min(paths[i - 1][1], paths[i][1]);
      const end = Math.max(paths[i - 1][1], paths[i][1]);
      for (let j = start; j <= end; j++) {
        (grid[paths[i][0]] ??= [])[j] = ROCK;
      }
    }
    if (paths[i - 1][1] === paths[i][1]) {
      const start = Math.min(paths[i - 1][0], paths[i][0]);
      const end = Math.max(paths[i - 1][0], paths[i][0]);
      for (let j = start; j <= end; j++) {
        (grid[j] ??= [])[paths[i][1]] = ROCK;
      }
    }
  }
}

const floor =
  grid.reduce(
    (prev, current) =>
      current == null || current.length < prev ? prev : current.length,
    0
  ) + 1;

const table = {
  undefined: ".",
  [ROCK]: "#",
  [SAND]: "o",
};
function printSchema() {
  console.log("-----");
  for (let y = 0; y < floor; y++) {
    for (let x = 489; x <= 513; x++) {
      process.stdout.write(table[grid[x]?.[y]]);
    }
    process.stdout.write("\n");
  }
}

let unitOfSandsProduced = 0;
function produceMoreSand() {
  let { x } = source;
  unitOfSandsProduced++;
  for (let y = source.y; y < floor; y++) {
    grid[x] ??= [];
    switch (grid[x][y + 1]) {
      case ROCK:
      case SAND:
        if (grid[x - 1]?.[y + 1] != null && grid[x + 1]?.[y + 1] != null) {
          grid[x][y] = SAND;
          return y !== source.y;
        } else if (grid[x - 1]?.[y + 1] != null) {
          x++;
        } else {
          x--;
        }
    }
  }
  if (grid[x][floor - 1] == null) {
    grid[x][floor - 1] = SAND;
  } else if (grid[x - 1][floor - 1] == null) {
    grid[x - 1][floor - 1] = SAND;
  } else if (grid[x + 1][floor - 1] == null) {
    grid[x + 1][floor - 1] = SAND;
  } else throw new Error("unreachable");
  return true;
}

while (produceMoreSand(source));

console.log({ unitOfSandsProduced, floor });
// printSchema();
