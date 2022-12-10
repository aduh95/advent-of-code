import { open } from "node:fs/promises";

const fh = await open(new URL("./10.txt", import.meta.url));

const CRT_DIMENSION = {
  w: 40,
  h: 6,
};
let cycle = 0;
let x = 1;

function draw() {
  process.stdout.write(Math.abs(cycle - x) < 2 ? "#" : ".");
  if (++cycle === CRT_DIMENSION.w) {
    process.stdout.write("\n");
    cycle = 0;
  }
}

for await (const line of fh.readLines()) {
  draw();
  if (line.startsWith("addx ")) {
    draw();
    x += Number(line.slice(5));
  }
}
