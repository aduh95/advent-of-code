import { open } from "node:fs/promises";

const fh = await open(new URL("./02.txt", import.meta.url));

// elf: A for Rock, B for Paper, and C for Scissors
// me: X for Rock, Y for Paper, and Z for Scissors
// Score:
// 1 for Rock, 2 for Paper, and 3 for Scissors
// 0 if you lost, 3 if the round was a draw, and 6 if you won

const shapeScore = {
  X: 1,
  Y: 2,
  Z: 3,
};

let score = 0;
for await (const line of fh.readLines()) {
  const [elf, , me] = line;
  score +=
    shapeScore[me] +
    3 * (elf.charCodeAt() + 23 === me.charCodeAt()) +
    6 *
      ((elf === "A" && me === "Y") ||
        (elf === "B" && me === "Z") ||
        (elf === "C" && me === "X") ||
        false);
}

console.log({ score });
