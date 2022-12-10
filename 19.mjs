import { open } from "node:fs/promises";

const fh = await open(new URL("./10.txt", import.meta.url));

let sum = 0;
let cycle = 1;
let x = 1;

function add() {
  switch (cycle) {
    case 20:
    case 60:
    case 100:
    case 140:
    case 180:
    case 220:
      sum += cycle * x;
  }
}

for await (const line of fh.readLines()) {
  if (line === "noop") {
    cycle++;
  } else {
    cycle++;
    add();
    x += Number(line.slice(5));
    cycle++;
  }
  add();
}

console.log({ sum });
