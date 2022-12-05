import { open } from "node:fs/promises";

const fh = await open(new URL("./05.txt", import.meta.url));

/** @type {string[][]} */
const crates = [];
const instructionRegex = /^move (\d+) from (\d+) to (\d+)$/;
let isDefiningOriginalCratesPosition = true;
for await (const line of fh.readLines()) {
  if (isDefiningOriginalCratesPosition) {
    if (line.includes("[")) {
      for (let i = 0; i < line.length; i += 4) {
        if (line[i] === "[") (crates[i / 4] ??= []).push(line[i + 1]);
      }
    } else {
      isDefiningOriginalCratesPosition = false;
    }
  } else {
    const match = instructionRegex.exec(line);
    if (match !== null) {
      const [, numberOfCrates, origin, target] = match;
      const originStack = crates[Number(origin) - 1];
      crates[Number(target) - 1].unshift(
        ...originStack.splice(0, numberOfCrates)
      );
    }
  }
}
const cratesAtTheTop = crates.map((c) => c.at(0)).join("");

console.log({ crates, cratesAtTheTop });
