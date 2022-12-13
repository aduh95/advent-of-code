import { open } from "node:fs/promises";

const fh = await open(new URL("./12.txt", import.meta.url));

const grid = [];
let startPosition;
let endPosition;

let x = 0;
for await (const line of fh.readLines()) {
  grid.push(
    Array.from(line, (char, y) => {
      switch (char) {
        case "S":
          startPosition = { x, y };
          return "a".charCodeAt();

        case "E":
          endPosition = { x, y };
          return "z".charCodeAt();

        default:
          return char.charCodeAt();
      }
    })
  );
  x++;
}

const invertTable = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

const alreadyVisited = new Set();
const jobs = [];
let minNumberOfSteps;
function tryEveryMoves(position, currentElevation, nbOfSteps, invertLastMove) {
  const { x, y } = position;

  if (x === endPosition.x && y === endPosition.y) {
    minNumberOfSteps = nbOfSteps;
    return true;
  }

  const serializedPosition = position.x + (position.y << 10);
  if (alreadyVisited.has(serializedPosition)) return false;
  alreadyVisited.add(serializedPosition);

  for (const [direction, elevation] of Object.entries({
    left: grid[x]?.[y - 1],
    right: grid[x]?.[y + 1],
    up: grid[x - 1]?.[y],
    down: grid[x + 1]?.[y],
  })) {
    if (
      direction === invertLastMove ||
      elevation == null ||
      elevation > currentElevation + 1
    )
      continue;

    let nextPosition;
    switch (direction) {
      case "up":
        nextPosition = { x: x - 1, y };
        break;

      case "down":
        nextPosition = { x: x + 1, y };
        break;

      case "left":
        nextPosition = { x, y: y - 1 };
        break;

      case "right":
        nextPosition = { x, y: y + 1 };
        break;
    }
    jobs.push(() =>
      tryEveryMoves(
        nextPosition,
        elevation,
        nbOfSteps + 1,
        invertTable[direction]
      )
    );
  }
}

tryEveryMoves(startPosition, "a".charCodeAt(), 0);
while (minNumberOfSteps == null) {
  for (const job of jobs.splice(0)) {
    job();
  }
}

console.log({ minNumberOfSteps });
