// https://adventofcode.com/2021/day/15
import * as fs from "fs";
import { MinHeap } from "utils";

const input = fs.readFileSync("inputs/day15.txt", "utf8");
const riskGrid = input.split("\n").map(row => row.split('').map(riskValue => +riskValue));

const startCoordinate = { x: 0, y: 0 }

type Coordinate = {
  x: number,
  y: number
}
type GridSize = {
  width: number;
  height: number;
}

function part1() {
  const gridSize: GridSize = {
    width: riskGrid[0].length,
    height: riskGrid.length
  }
  const endCoordinate = {
    x: riskGrid[0].length - 1,
    y: riskGrid.length - 1
  }
  return findLeastRiskyPath(endCoordinate, gridSize).pathRisk;
}

function part2() {
  const sizeMultiplier = 5;
  const gridSize: GridSize = {
    width: riskGrid[0].length * sizeMultiplier,
    height: riskGrid.length * sizeMultiplier
  }
  const endCoordinate = {
    x: riskGrid[0].length * sizeMultiplier - 1,
    y: riskGrid.length * sizeMultiplier - 1
  }
  return findLeastRiskyPath(endCoordinate, gridSize).pathRisk;
}

class Path {
  pathRisk: number;

  constructor(public coordinate: Coordinate, path?: Path) {
    this.pathRisk = (path?.pathRisk ?? 0) + getRiskLevel(coordinate);
  }

  getMinRiskFromGoal(goal: Coordinate) {
    // Risk is minimum of 1, so min risk is number of steps needed for goal in optimal situation
    const distance = Math.abs(this.coordinate.x - goal.x) + Math.abs(this.coordinate.y - goal.y);
    return this.pathRisk + distance;
  }
}

function findLeastRiskyPath(endCoordinate: Coordinate, gridSize: GridSize) {
  const riskHeap = new MinHeap<Path>(path => path.getMinRiskFromGoal(endCoordinate));
  const startPath = new Path(startCoordinate);
  startPath.pathRisk = 0;
  riskHeap.addItem(startPath);
  const visitedCoordinates = new Set<string>();

  while (riskHeap.length) {
    const nextSmallestPath = riskHeap.pop();
    if (nextSmallestPath.coordinate.x === endCoordinate.x && nextSmallestPath.coordinate.y === endCoordinate.y) {
      return nextSmallestPath;
    }
    visitedCoordinates.add(coordToKey(nextSmallestPath.coordinate));
    const adjacentCoords = getAdjacentCoords(nextSmallestPath.coordinate, gridSize).filter(coord => !visitedCoordinates.has(coordToKey(coord)));
    const adjacentPaths = adjacentCoords.map(coord => new Path(coord, nextSmallestPath));
    riskHeap.addItems(adjacentPaths);
  }
  // No path found
  throw new Error("No path found");
}

function getAdjacentCoords({ x, y }: Coordinate, { width, height }: GridSize) {
  const coords = [];
  if (x > 0) {
    coords.push({ x: x - 1, y })
  }
  if (x + 1 < width) {
    coords.push({ x: x + 1, y })
  }
  if (y > 0) {
    coords.push({ x, y: y - 1 })
  }
  if (y + 1 < height) {
    coords.push({ x, y: y + 1 })
  }
  return coords;
}

function getRiskLevel({ x, y }: Coordinate) {
  const incrementX = Math.floor(x / riskGrid[0].length);
  const incrementY = Math.floor(y / riskGrid.length);
  const gridX = x % riskGrid[0].length;
  const gridY = y % riskGrid.length;
  return ((riskGrid[gridY][gridX] + incrementX + incrementY - 1) % 9) + 1;
}

function coordToKey({ x, y }: Coordinate) {
  return `${x},${y}`;
}

console.log("Part 1", part1());
console.log("Part 2", part2());
