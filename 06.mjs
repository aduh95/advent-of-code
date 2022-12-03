import { open } from "node:fs/promises";

const fh = await open(new URL("./03.txt", import.meta.url));

const UPPER_CASE_OFFSET = 27 - "A".charCodeAt();
const LOWER_CASE_OFFSET = 1 - "a".charCodeAt();

let sumOfPriorities = 0;
let lines = [];
for await (const line of fh.readLines()) {
  lines.push(line);
  if (lines.length === 3) {
    const letters = lines
      .splice(0, 3)
      .reduce(
        (prev, current) =>
          Array.from(current).filter(
            prev == null ? () => true : (letter) => prev.includes(letter)
          ),
        undefined
      );
    if (new Set(letters).size !== 1)
      throw new Error("Expected length of 1", { cause: letters });
    const [letter] = letters;
    sumOfPriorities +=
      letter.charCodeAt() +
      (letter.toUpperCase() === letter ? UPPER_CASE_OFFSET : LOWER_CASE_OFFSET);
  }
}

console.log({ sumOfPriorities });
