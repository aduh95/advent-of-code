import { open } from "node:fs/promises";

const fh = await open(new URL("./11.txt", import.meta.url));

class Item {
  worryLevel;

  constructor(worryLevel) {
    this.worryLevel = worryLevel;
  }
}
class Monkey {
  /** @type {Item[]} */
  holdingItems;
  itemInspected = 0;
  operation;
  divisibleTest;

  ifDivisible;
  ifNotDivisible;
}
const monkeys = [];
let currentMonkey;

for await (const line of fh.readLines()) {
  if (line.startsWith("Monkey ")) {
    monkeys.push((currentMonkey = new Monkey()));
  } else if (line.startsWith("  Starting items: ")) {
    currentMonkey.holdingItems = line
      .slice(18)
      .split(", ")
      .map((l) => new Item(BigInt(l)));
  } else if (line.startsWith("  Operation: new = ")) {
    currentMonkey.operation = new Function(
      "old",
      `return ${line.slice(18)}${/\d$/.test(line) ? "n" : ""}`
    );
  } else if (line.startsWith("  Test: divisible by ")) {
    currentMonkey.divisibleTest = BigInt(line.slice(21));
  } else if (line.startsWith("    If true: throw to monkey ")) {
    currentMonkey.ifDivisible = line.slice(29);
  } else if (line.startsWith("    If false: throw to monkey ")) {
    currentMonkey.ifNotDivisible = line.slice(30);
  }
}

const multiplierFactor = monkeys.reduce(
  (prev, current) => prev * current.divisibleTest,
  1n
);

for (let i = 0; i < 10_000; i++) {
  for (const monkey of monkeys) {
    for (const item of monkey.holdingItems.splice(0)) {
      monkey.itemInspected++;
      item.worryLevel = monkey.operation(item.worryLevel) % multiplierFactor;
      monkeys[
        item.worryLevel % monkey.divisibleTest
          ? monkey.ifNotDivisible
          : monkey.ifDivisible
      ].holdingItems.push(item);
    }
  }
}

monkeys.sort((a, b) => b.itemInspected - a.itemInspected);

const monkeyBusiness = monkeys[0].itemInspected * monkeys[1].itemInspected;
console.log({ monkeyBusiness });
