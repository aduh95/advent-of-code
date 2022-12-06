import { open } from "node:fs/promises";

const fh = await open(new URL("./06.txt", import.meta.url));

const buffer = new Uint8Array(4);
let { bytesRead } = await fh.read({ buffer });
let position = bytesRead;
while (bytesRead !== 0) {
  if (new Set(buffer).size === buffer.byteLength) {
    console.log(position);
    process.exit();
  }
  ({ bytesRead } = await fh.read({
    buffer,
    length: 1,
    offset: position % buffer.byteLength,
    position,
  }));
  position += bytesRead;
}

console.log("No start-of-packet marker found");
