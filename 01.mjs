import { open } from "node:fs/promises";

const fh = await open(new URL("./01.txt", import.meta.url));

let max = Number.MIN_SAFE_INTEGER;
let accumulator = 0;
for await (const line of fh.readLines()) {
  if (line === "") {
    max = Math.max(max, accumulator);
    accumulator = 0;
  } else {
    accumulator += Number(line);
  }
}

console.log({ max });
