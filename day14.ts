// https://adventofcode.com/2021/day/14
import * as fs from "fs";
import { getRange, toCountMap } from './utils';

const input = fs.readFileSync("inputs/day14.txt", "utf8");

const [polymerInput, ruleInput] = input.split('\n\n');
const startPolymer = polymerInput.split('');
const rules = new Map(
  ruleInput.split('\n').map(rule => rule.split(' -> ') as [string, string])
);

function part1() {
  return getResult(10);
}

function part2() {
  return getResult(40);
}

function getResult(steps: number) {
  let elementCounts = toCountMap(startPolymer);
  let elementPairCounts = toCountMap(getElementPairs(startPolymer));
  for (let i in getRange(0, steps)) {
    [elementCounts, elementPairCounts] = processRules(elementCounts, elementPairCounts);
  }
  const min = Math.min(...elementCounts.values())
  const max = Math.max(...elementCounts.values());
  return max - min;
}

/**
 * Returns all sequential pairs from polymer array
 * Assumes each element in polymer is a single character
 */
function getElementPairs(polymer: string[]) {
  const elementPairs = [];
  for (let i = 1; i < polymer.length; i++) {
    const pair = polymer[i - 1] + polymer[i];
    elementPairs.push(pair);
  }
  return elementPairs;
}

function processRules(elementCounts: Map<string, number>, elementPairCounts: Map<string, number>) {
  const newElementCounts = new Map(elementCounts);
  // Starting elementPairCount map as empty, since all old pairs get replaced
  const newElementPairCounts = new Map();
  for (let [elementPair, count] of elementPairCounts.entries()) {
    const ruleElement = rules.get(elementPair);
    if (!ruleElement) {
      // No rule => no changes
      // In practise there isn't a need to set the value for this elementPair, since it never causes reactions.
      // Keeping it for consistency
      newElementPairCounts.set(elementPair, count);
      continue;
    }
    // Add new pairs
    const ruleKey1 = elementPair[0] + ruleElement;
    const ruleKey2 = ruleElement + elementPair[1];
    const ruleElementCount1 = newElementPairCounts.get(ruleKey1) || 0;
    const ruleElementCount2 = newElementPairCounts.get(ruleKey2) || 0;
    newElementPairCounts.set(ruleKey1, ruleElementCount1 + count);
    newElementPairCounts.set(ruleKey2, ruleElementCount2 + count);
    // Increment the inserted element counter
    newElementCounts.set(ruleElement, (newElementCounts.get(ruleElement) || 0) + count);
  }
  return [newElementCounts, newElementPairCounts];
}

console.log("Part 1", part1());
console.log("Part 2", part2());

