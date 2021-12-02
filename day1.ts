// https://adventofcode.com/2021/day/1
import * as fs from "fs";

const input = fs.readFileSync("inputs/day1.txt", "utf8");
const depths = input.split("\n").map(str => +str);

function part1() {
  return getDepthIncrements(1);
}

function part2() {
  return getDepthIncrements(3);
}

function getDepthIncrements(windowSize: number) {
  let increments = 0;
  // i is end of second window in comparisons
  for (let i = windowSize; i < depths.length; i++) {
    // Windows are the same except for first number of first findow and last number of second,
    // so only they need to be compared
    if (depths[i] > depths[i - windowSize]) {
      increments++;
    }
  }
  return increments;
}

console.log("Part 1", part1());
console.log("Part 2", part2());

