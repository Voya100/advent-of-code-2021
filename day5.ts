// https://adventofcode.com/2021/day/5
import * as fs from "fs";

const input = fs.readFileSync("inputs/day5.txt", "utf8");

type Coord = [x: number, y: number];
type Line = {
  startCoord: Coord;
  endCoord: Coord;
};

const linesInput = input.split('\n')
  .map(
    row => {
      const coords = row.split(' -> ').map(
        coordStr => coordStr.split(',').map(value => +value) as Coord
      )
      return {
        startCoord: coords[0],
        endCoord: coords[1]
      }
    });


function part1() {
  const horizontalOrVerticalLines = linesInput.filter(isLineHorizontalOrVertical);
  const counts = getCoordinateLineCounts(horizontalOrVerticalLines);
  return [...counts.values()].filter(count => count > 1).length;
}

function part2() {
  const counts = getCoordinateLineCounts(linesInput);
  return [...counts.values()].filter(count => count > 1).length;
}

function isLineHorizontalOrVertical(line: Line) {
  return line.startCoord[0] === line.endCoord[0] || line.startCoord[1] === line.endCoord[1];
}

// Note: Implementation assumes that lines are not extremely long.
// Solution is not optimal for arbitary line lengths when it comes to performance or memory usage
function getCoordinateLineCounts(lines: Line[]) {
  const coordinateLineCounts: Map<string, number> = new Map();
  for (let line of lines) {
    const { startCoord, endCoord } = line;
    const xRange = getRange(startCoord[0], endCoord[0]);
    const yRange = getRange(startCoord[1], endCoord[1]);

    for (let i = 0; i < Math.max(xRange.length, yRange.length); i++) {
      // If line is horizontal or vertical, range will give undefined for x or y after index 0, 
      // in which case that x/y is always the same (start/end coord)
      // For diagonals ranges are of equal length
      const x = xRange[i] ?? startCoord[0];
      const y = yRange[i] ?? startCoord[1];
      const key = coordToKey([x, y])
      const count = coordinateLineCounts.get(key);
      if (count) {
        coordinateLineCounts.set(key, count + 1);
      } else {
        coordinateLineCounts.set(key, 1);
      }
    }
  }
  return coordinateLineCounts;
}

function getRange(start: number, inclusiveEnd: number) {
  const range: number[] = [];
  if (start <= inclusiveEnd) {
    for (let i = start; i <= inclusiveEnd; i++) {
      range.push(i);
    }
  } else {
    for (let i = start; i >= inclusiveEnd; i--) {
      range.push(i)
    }
  }
  return range;
}

function coordToKey(coord: Coord) {
  return coord.join(',');
}

console.log("Part 1", part1());
console.log("Part 2", part2());