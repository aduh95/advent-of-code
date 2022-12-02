import { open } from "node:fs/promises";

const fh = await open(new URL("./02.txt", import.meta.url));

// A for Rock, B for Paper, and C for Scissors
// X means you need to lose, Y means you need to end the round in a draw, and Z means you need to win

// (1 for Rock, 2 for Paper, and 3 for Scissors
// 0 if you lost, 3 if the round was a draw, and 6 if you won

const shapeScore = {
  A: 1,
  B: 2,
  C: 3,
};
const resultScore = {
  X: 0,
  Y: 3,
  Z: 6,
};

const drawMove = {
  A: "A",
  B: "B",
  C: "C",
};
const losingMove = {
  A: "C",
  B: "A",
  C: "B",
};
const winningMove = {
  A: "B",
  B: "C",
  C: "A",
};
const move = {
  X: losingMove,
  Y: drawMove,
  Z: winningMove,
};

let score = 0;
for await (const line of fh.readLines()) {
  const [elf, , instruction] = line;

  const me = move[instruction][elf];
  score += shapeScore[me] + resultScore[instruction];
}

console.log({ score });
