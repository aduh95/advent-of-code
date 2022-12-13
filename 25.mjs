import { open } from "node:fs/promises";

const fh = await open(new URL("./13.txt", import.meta.url));

function compare(left, right) {
  if (typeof left === "number" && typeof right === "number") {
    if (left === right) return;
    return left < right;
  }
  if (Array.isArray(left) && Array.isArray(right)) {
    for (let i = 0; i < left.length; i++) {
      if (right[i] == null) return false;
      const result = compare(left[i], right[i]);
      if (result != null) return result;
    }
    if (left.length === right.length) return;
    return true;
  }
  if (Array.isArray(left)) return compare(left, [right]);
  if (Array.isArray(right)) return compare([left], right);
}

let previous;
let index = 1;
let sumOfIndices = 0;
for await (const line of fh.readLines()) {
  if (line === "") continue;
  if (previous == null) {
    previous = JSON.parse(line);
  } else {
    const current = JSON.parse(line);
    if (compare(previous, current)) {
      sumOfIndices += index;
    }
    previous = null;
    index++;
  }
}

console.log({ sumOfIndices });
