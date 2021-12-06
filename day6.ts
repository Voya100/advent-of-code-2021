// https://adventofcode.com/2021/day/6
import * as fs from "fs";
import { sum, toCountMap } from './utils';

const input = fs.readFileSync("inputs/day6.txt", "utf8");

const timersInput = input.split(",").map(str => +str);

// Note: Real interval is 7, but using value based on 0 indexing
const fishInterval = 6;
const newFishInterval = fishInterval + 2;
const maxInterval = newFishInterval;

function part1() {
  return countFish(80);
}

function part2() {
  return countFish(256);
}

function countFish(rounds: number) {
  const countMap = toCountMap(timersInput);
  let timerCounts = [];

  for (let i = 0; i <= maxInterval; i++) {
    timerCounts.push(countMap.get(i) || 0);
  }

  for (let round = 0; round < rounds; round++) {
    const birthCount = timerCounts[0];
    // All except those with timer being 0, all moved by 1 to the lefts
    timerCounts = timerCounts.slice(1);
    timerCounts[fishInterval] += birthCount;
    // Since array size is kept the same for each round, this is newFishInterval index
    timerCounts.push(birthCount);
  }
  return sum(timerCounts, count => count);
}

console.log("Part 1", part1());
console.log("Part 2", part2());

