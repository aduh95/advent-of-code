import { open } from "node:fs/promises";

const fh = await open(new URL("./07.txt", import.meta.url));

const fileLine = /^(\d+) (.+)$/;

const availableSpace = 70_000_000;
const neededSpace = 30_000_000;

const sizeMap = new Map();
const tree = {};
const directories = [tree];
tree[".."] = tree;
let currentDir;
let isListing = false;
for await (const line of fh.readLines()) {
  if (line[0] === "$") {
    isListing = false;
    if (line.startsWith("$ cd")) {
      if (line === "$ cd /") {
        currentDir = tree;
      } else {
        currentDir = currentDir[line.slice(5)];
      }
    } else if (line.startsWith("$ ls")) {
      isListing = true;
    }
  } else if (isListing) {
    if (line.startsWith("dir ")) {
      currentDir[line.slice(4)] = {};
      directories.unshift(currentDir[line.slice(4)]);
      currentDir[line.slice(4)][".."] = currentDir;
    } else {
      const match = fileLine.exec(line);
      currentDir[match[2]] = Number(match[1]);
    }
  }
}

for (const dir of directories) {
  let total = 0;
  for (const [name, content] of Object.entries(dir)) {
    if (name === "..") continue;
    if (typeof content === "number") {
      total += content;
    } else {
      total += sizeMap.get(content);
    }
  }

  sizeMap.set(dir, total);
}

let dirToDeleteSize = sizeMap.get(tree);
const spaceToFreeUp = neededSpace - availableSpace + dirToDeleteSize;

for (const dir of directories) {
  const size = sizeMap.get(dir);
  if (size >= spaceToFreeUp && size < dirToDeleteSize) {
    dirToDeleteSize = size;
  }
}

console.log({ dirToDeleteSize });
