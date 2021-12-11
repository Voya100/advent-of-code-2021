// https://adventofcode.com/2021/day/11
import * as fs from "fs";

const input = fs.readFileSync("inputs/day11.txt", "utf8");

type Coord = [x: number, y: number];

const energyGrid = input.split("\n").map(
  row => row.split('').map(str => +str)
);

// Assuming width and height are same
const gridWidth = energyGrid.length;

function part1() {
  const rounds = 100;
  let flashCount = 0;
  let grid = energyGrid;
  for (let i = 0; i < rounds; i++) {
    const roundResult = runRound(grid);
    grid = roundResult.grid;
    flashCount += roundResult.flashCount;
  }
  return flashCount;
}

function part2() {
  let grid = energyGrid;
  let roundCounter = 0;
  const numberOfCells = gridWidth * gridWidth;
  while (true) {
    roundCounter++;
    const roundResult = runRound(grid);
    grid = roundResult.grid;
    if (roundResult.flashCount === numberOfCells) {
      return roundCounter;
    }
  }
}

function runRound(grid: number[][]) {
  let flashCount = 0;
  grid = grid.map(row => row.map(value => value + 1));
  while (hasFlashing(grid)) {
    flashCount += getFlashCount(grid);
    grid = grid.map((row, j) => row.map((_, i) => getUpdatedEnergy([i, j], grid)));
  }
  return { grid, flashCount };
}

function hasFlashing(grid: number[][]) {
  return grid.flat().some(energy => energy > 9);
}

function getFlashCount(grid: number[][]) {
  return grid.flat().filter(energy => energy > 9).length;
}

function getUpdatedEnergy(coord: Coord, grid: number[][]) {
  const adjacentEnergies = getAdjacentEnergies(coord, grid);
  const currentEnergy = coordToEnergy(coord, grid);
  if (currentEnergy === 0 || currentEnergy > 9) {
    return 0;
  }
  const adjacentFlashing = adjacentEnergies.filter(energy => energy > 9).length;
  return currentEnergy + adjacentFlashing;
}

function getAdjacentEnergies([x, y]: Coord, grid: number[][]) {
  return getAdjacentCoords(x, y).map(([x, y]) => grid[y][x]);
}

function getAdjacentCoords(x: number, y: number) {
  const coords = [];
  for (let j = -1; j <= 1; j++) {
    const adjacentY = y + j;
    if (adjacentY < 0 || adjacentY >= gridWidth) {
      continue;
    }
    for (let i = -1; i <= 1; i++) {
      const adjacentX = x + i;
      if (adjacentX < 0 || adjacentX >= gridWidth || (j === 0 && i === 0)) {
        continue;
      }
      coords.push([adjacentX, adjacentY]);
    }
  }
  return coords;
}

function coordToEnergy([x, y]: [x: number, y: number], grid: number[][]) {
  return grid[y][x];
}

console.log("Part 1", part1());
console.log("Part 2", part2());
