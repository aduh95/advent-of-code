import { open } from "node:fs/promises";

const fh = await open(new URL("./01.txt", import.meta.url));

const caloriesPerElfes = [];
let accumulator = 0;
for await (const line of fh.readLines()) {
  if (line === "") {
    caloriesPerElfes.push(accumulator);
    accumulator = 0;
  } else {
    accumulator += Number(line);
  }
}
if (accumulator) caloriesPerElfes.push(accumulator);

const first = Math.max.apply(null, caloriesPerElfes);
caloriesPerElfes.splice(caloriesPerElfes.indexOf(first), 1);
const second = Math.max.apply(null, caloriesPerElfes);
caloriesPerElfes.splice(caloriesPerElfes.indexOf(second), 1);
const third = Math.max.apply(null, caloriesPerElfes);

const sum = first + second + third;

console.log({ sum, first, second, third });
