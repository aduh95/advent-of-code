import { open } from "node:fs/promises";

const fh = await open(new URL("./09.txt", import.meta.url));

const visitedByTail = new Set();
const createPositionObject = () => {
  const position = new Uint32Array(1);
  const x = new Int16Array(position.buffer, 0, 1);
  const y = new Int16Array(position.buffer, 2, 1);

  return { position, x, y };
};
const head = createPositionObject();
const knots = Array.from({ length: 9 }, () => {
  const tail = createPositionObject();
  tail.position[0] = head.position[0];
  return tail;
});

const moveHead = {
  U() {
    head.x[0]++;
  },
  D() {
    head.x[0]--;
  },

  R() {
    head.y[0]++;
  },
  L() {
    head.y[0]--;
  },
};

function moveTail(head, tail) {
  if (head.position[0] === tail.position[0]) return;

  const diffX = head.x[0] - tail.x[0];
  const diffY = head.y[0] - tail.y[0];

  if (diffX === 0) {
    if (diffY === 2) {
      tail.y[0]++;
    } else if (diffY === -2) {
      tail.y[0]--;
    }
  } else if (diffY === 0) {
    if (diffX === 2) {
      tail.x[0]++;
    } else if (diffX === -2) {
      tail.x[0]--;
    }
  } else if (Math.abs(diffX) === 2) {
    if (diffX > 0) {
      tail.x[0]++;
    } else {
      tail.x[0]--;
    }
    if (diffY > 0) {
      tail.y[0]++;
    } else {
      tail.y[0]--;
    }
  } else if (Math.abs(diffY) === 2) {
    if (diffY > 0) {
      tail.y[0]++;
    } else {
      tail.y[0]--;
    }
    if (diffX > 0) {
      tail.x[0]++;
    } else {
      tail.x[0]--;
    }
  }
}

visitedByTail.add(knots.at(-1).position[0]);
for await (const line of fh.readLines()) {
  const direction = line[0];
  const nbSteps = Number(line.slice(2));

  for (let i = 0; i < nbSteps; i++) {
    moveHead[direction]();
    for (let i = 0; i < knots.length; i++) {
      moveTail(i === 0 ? head : knots[i - 1], knots[i]);
    }
    visitedByTail.add(knots.at(-1).position[0]);
  }
}

console.log(visitedByTail.size);
