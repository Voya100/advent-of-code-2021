// https://adventofcode.com/2021/day/13
import * as fs from "fs";
import { getRange } from './utils';

const input = fs.readFileSync("inputs/day13.txt", "utf8");

const [coordInput, foldInput] = input.split("\n\n");
type Coord = { x: number, y: number };
type Fold = { direction: 'x' | 'y', coordinateValue: number }

const initialCoords: Coord[] = coordInput.split('\n').map(stringToCoord);
const folds: Fold[] = foldInput.split('\n').map(rowToFold);

function part1() {
  const foldedCoords = foldCoords(initialCoords, folds[0]);
  return getUniqueCoords(foldedCoords).size;
}

function part2() {
  let foldedCoords = initialCoords;
  for (let fold of folds) {
    foldedCoords = foldCoords(foldedCoords, fold);
  }
  const uniqueCoords = getUniqueCoords(foldedCoords);
  return '\n' + visalise(uniqueCoords);
}

function stringToCoord(string: string): Coord {
  const [x, y] = string.split(',').map(value => +value);
  return { x, y }
}

function rowToFold(row: string) {
  const [direction, coordinateValue] = row.split('fold along ')[1].split('=');
  return { direction, coordinateValue: +coordinateValue } as Fold;
}

function foldCoords(coords: Coord[], fold: Fold) {
  return coords.map(({ x, y }) => {
    if (fold.direction === 'x') {
      return {
        x: x < fold.coordinateValue ? x : fold.coordinateValue - (x - fold.coordinateValue),
        y
      }
    } else {
      return {
        x,
        y: y < fold.coordinateValue ? y : fold.coordinateValue - (y - fold.coordinateValue)
      }
    }
  })
}

function getUniqueCoords(coords: Coord[]) {
  return new Set(coords.map(({ x, y }) => `${x},${y}`));
}

function visalise(coords: Set<string>) {
  const maxX = Math.max(...[...coords.values()].map(coord => stringToCoord(coord).x));
  const maxY = Math.max(...[...coords.values()].map(coord => stringToCoord(coord).y));

  return getRange(0, maxY + 1).map(
    y => getRange(0, maxX + 1).map(x => coords.has(`${x},${y}`) ? '#' : '.').join('')
  ).join('\n');
}

console.log("Part 1", part1());
console.log("Part 2", part2());

