import { open } from "node:fs/promises";

const fh = await open(new URL("./04.txt", import.meta.url));

let sum = 0;
for await (const line of fh.readLines()) {
  const [elfA, elfB] = line.split(",").map((str) => str.split("-").map(Number));
  sum +=
    (elfA[0] >= elfB[0] && elfA[1] <= elfB[1]) ||
    (elfB[0] >= elfA[0] && elfB[1] <= elfA[1]);
}

console.log({ sum });
