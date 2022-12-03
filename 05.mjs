import { open } from "node:fs/promises";

const fh = await open(new URL("./03.txt", import.meta.url));

const UPPER_CASE_OFFSET = 27 - "A".charCodeAt();
const LOWER_CASE_OFFSET = 1 - "a".charCodeAt();

let sumOfPriorities = 0;
for await (const line of fh.readLines()) {
  const middle = line.length / 2;

  const letter = Array.from(line).find((letter, index, arr) =>
    index >= middle
      ? arr.lastIndexOf(letter, middle) !== -1
      : arr.indexOf(letter, middle) !== -1
  );
  sumOfPriorities +=
    letter.charCodeAt() +
    (letter.toUpperCase() === letter ? UPPER_CASE_OFFSET : LOWER_CASE_OFFSET);
}

console.log({ sumOfPriorities });
