import { open } from "node:fs/promises";

const fh = await open(new URL("./06.txt", import.meta.url));

const checkBuffer = (buf) => new Set(buf).size === 4;

const buffer = new Uint8Array(4);
let { bytesRead } = await fh.read({ buffer, length: 4 });
let position = bytesRead;
do {
  if (checkBuffer(buffer)) {
    console.log(position);
    process.exit();
  }
  ({ bytesRead } = await fh.read({
    buffer,
    length: 1,
    offset: position % 4,
    position,
  }));
  position += bytesRead;
} while (bytesRead !== 0);

console.log("No start-of-packet marker found");
