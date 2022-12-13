import { open } from "node:fs/promises";

const fh = await open(new URL("./12.txt", import.meta.url));

const LOWEST_ELEVATION = "a".charCodeAt();

const grid = [];
let startPositions = [];
let endPosition;

let x = 0;
for await (const line of fh.readLines()) {
  grid.push(
    Array.from(line, (char, y) => {
      switch (char) {
        case "S":
        case "a":
          startPositions.push({ x, y });
          return LOWEST_ELEVATION;

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

const jobs = [];
function tryEveryMoves(
  position,
  currentElevation,
  alreadyVisited,
  nbOfSteps,
  invertLastMove
) {
  const { x, y } = position;

  if (x === endPosition.x && y === endPosition.y) {
    return nbOfSteps;
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
      elevation === LOWEST_ELEVATION ||
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
        alreadyVisited,
        nbOfSteps + 1,
        invertTable[direction]
      )
    );
  }
}

let minNumberOfSteps = Number.MAX_SAFE_INTEGER;
for (const startPosition of startPositions) {
  tryEveryMoves(startPosition, LOWEST_ELEVATION, new Set(), 0);
  let nbOfSteps;
  while (nbOfSteps == null && jobs.length !== 0) {
    for (const job of jobs.splice(0)) {
      const result = job();
      if (result) {
        nbOfSteps = result;
        break;
      }
    }
  }
  if (nbOfSteps && nbOfSteps < minNumberOfSteps) minNumberOfSteps = nbOfSteps;
}

console.log({ minNumberOfSteps });
