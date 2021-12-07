// https://adventofcode.com/2021/day/7
import * as fs from "fs";
import { sum } from './utils';

const input = fs.readFileSync("inputs/day7.txt", "utf8");

const positions = input.split(",").map(str => +str);
positions.sort((a, b) => a - b); // Needed for optimised solution

function part1() {
  return getMinDistanceSum((crabPosition: number, targetPosition: number) => Math.abs(targetPosition - crabPosition));
}

function part2() {
  return getMinDistanceSum(getFuelPart2);
}

function getMinDistanceSum(getFuel: (crabPosition: number, targetPosition: number) => number) {
  const min = Math.min(...positions);
  const max = Math.max(...positions);
  let minDistanceSum = Infinity;

  for (let targetPosition = min; targetPosition <= max; targetPosition++) {
    const distanceSum = sum(positions, crabPosition => getFuel(crabPosition, targetPosition));
    minDistanceSum = Math.min(minDistanceSum, distanceSum);
  }
  return minDistanceSum;
}

function getFuelPart2(crabPosition: number, targetPosition: number) {
  if (crabPosition === targetPosition) {
    return 0;
  }
  return sequenceSum(Math.abs(targetPosition - crabPosition));
}

function sequenceSum(n: number) {
  return n * (n + 1) / 2;
}

// Linear version for part 1 (not including sorting in beginning)
function part1Optimised() {
  const min = Math.min(...positions);
  const max = Math.max(...positions);
  // leftDistanceSum tracks sum of distances on left side of positionIndex
  // rightDistanceSum tracks sum of distances to right of positionIndex, including the index
  let leftDistanceSum = 0;
  let rightDistanceSum = sum(positions, position => position - min);
  let positionIndex = 0;
  let minDistanceSum = Infinity;

  // Init positionIndex for first round
  while (positions[positionIndex] === min) {
    positionIndex++;
  }

  for (let position = min + 1; position <= max; position++) {
    leftDistanceSum += positionIndex;
    // Skip values at current position
    while (positions[positionIndex] === position) {
      positionIndex++;
      rightDistanceSum--;
    }
    rightDistanceSum -= (positions.length - positionIndex);
    minDistanceSum = Math.min(minDistanceSum, leftDistanceSum + rightDistanceSum);
  }
  return minDistanceSum;
}

console.log("Part 1", part1());
console.log("Part 2", part2());

