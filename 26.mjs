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

const dividerPacketA = [[2]];
const dividerPacketB = [[6]];
const packets = [dividerPacketA, dividerPacketB];
for await (const line of fh.readLines()) {
  if (line === "") continue;
  packets.push(JSON.parse(line));
}

const comparisonTable = {
  false: 1,
  undefined: 0,
  true: -1,
};
packets.sort((a, b) => comparisonTable[compare(a, b)]);

const decoderKey =
  (packets.indexOf(dividerPacketA) + 1) * (packets.indexOf(dividerPacketB) + 1);

console.log({ decoderKey });
