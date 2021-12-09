// https://adventofcode.com/2021/day/9
import * as fs from "fs";
import { sum } from './utils';

const input = fs.readFileSync("inputs/day9.txt", "utf8");

const depthMap = input.split("\n").map(
  row => row.split('').map(str => +str)
);

function part1() {
  const lowPointDepths = getLowPoints().map(coordToDepth);
  return sum(lowPointDepths, getRiskLevel);
}

function part2() {
  const basinSizes = getLowPoints().map(getBasinSize);
  basinSizes.sort((a, b) => b - a); // Descending order
  return basinSizes[0] * basinSizes[1] * basinSizes[2];
}

function getLowPoints() {
  let lowPoints: [x: number, y: number][] = [];
  for (let j = 0; j < depthMap.length; j++) {
    for (let i = 0; i < depthMap[j].length; i++) {
      if (isLowPoint(i, j)) {
        lowPoints.push([i, j]);
      }
    }
  }
  return lowPoints;
}

function isLowPoint(x: number, y: number) {
  const coordDepth = depthMap[y][x];
  return getAdjacentDepths(x, y).every(depth => depth > coordDepth);
}

function getAdjacentDepths(x: number, y: number) {
  return getAdjacentCoords(x, y).map(([x, y]) => depthMap[y][x]);
}

function getAdjacentCoords(x: number, y: number) {
  const coords = [];
  if (x > 0) {
    coords.push([x - 1, y])
  }
  if (x + 1 < depthMap[y].length) {
    coords.push([x + 1, y])
  }
  if (y > 0) {
    coords.push([x, y - 1])
  }
  if (y + 1 < depthMap.length) {
    coords.push([x, y + 1])
  }
  return coords;
}

function getRiskLevel(depth: number) {
  return depth + 1;
}

function getBasinSize([x, y]: [x: number, y: number]) {
  const checkedCoordinates = new Set<string>();
  let coordinatesToCheck = [[x, y]];
  while (coordinatesToCheck.length) {
    let newCoordinatesToCheck = [];
    for (let [x, y] of coordinatesToCheck) {
      const key = coordToStr(x, y);
      if (checkedCoordinates.has(key)) {
        continue;
      }
      checkedCoordinates.add(coordToStr(x, y));
      const newAdjacentToCheck = getAdjacentCoords(x, y)
        .filter(([x, y]) => depthMap[y][x] !== 9 && !checkedCoordinates.has(coordToStr(x, y)));
      newCoordinatesToCheck.push(...newAdjacentToCheck);
    }
    coordinatesToCheck = newCoordinatesToCheck;
  }
  return checkedCoordinates.size;
}

function coordToStr(x: number, y: number) {
  return `${x},${y}`;
}

function coordToDepth([x, y]: [x: number, y: number]) {
  return depthMap[y][x];
}

console.log("Part 1", part1());
console.log("Part 2", part2());
