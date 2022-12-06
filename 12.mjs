import { open } from "node:fs/promises";

const fh = await open(new URL("./06.txt", import.meta.url));

const checkBuffer = (buf) => new Set(buf).size === 14;

const buffer = new Uint8Array(14);
let { bytesRead } = await fh.read({ buffer, length: 14 });
let position = bytesRead;
do {
  if (checkBuffer(buffer)) {
    console.log(position);
    process.exit();
  }
  ({ bytesRead } = await fh.read({
    buffer,
    length: 1,
    offset: position % 14,
    position,
  }));
  position += bytesRead;
} while (bytesRead !== 0);

console.log("No start-of-packet marker found");
