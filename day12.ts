// https://adventofcode.com/2021/day/12
import * as fs from "fs";

const input = fs.readFileSync("inputs/day12.txt", "utf8");

const paths = input.split("\n").map(str => str.split('-'));

const cavesWithForbiddenDoubleVisit = ['start', 'end'];

class Cave {
  connectedCaves: Cave[] = [];

  constructor(public caveName: string) { }

  addPath(cave: Cave) {
    this.connectedCaves.push(cave);
  }

  get isBigCave() {
    return this.caveName.toUpperCase() === this.caveName;
  }
}

function part1() {
  const graph = getGraph();
  return getUniquePaths(graph.get('start'), graph.get('end'), [], false);
}

function part2() {
  const graph = getGraph();
  return getUniquePaths(graph.get('start'), graph.get('end'), [], true);
}

function getGraph() {
  const caveGraph = new Map<string, Cave>();

  for (let [name1, name2] of paths) {
    const cave1 = caveGraph.get(name1) || new Cave(name1);
    const cave2 = caveGraph.get(name2) || new Cave(name2);
    if (!caveGraph.has(name1)) {
      caveGraph.set(name1, cave1);
    }
    if (!caveGraph.has(name2)) {
      caveGraph.set(name2, cave2);
    }
    cave1.addPath(cave2);
    cave2.addPath(cave1);
  }
  return caveGraph;
}

function getUniquePaths(currentCave: Cave, goalCave: Cave, visitedCaves: Cave[], allowDoubleVisit: boolean): number {
  if (currentCave === goalCave) {
    return 1;
  }
  visitedCaves.push(currentCave);
  let pathSum = 0;
  for (let cave of currentCave.connectedCaves) {
    if (cave.isBigCave || !visitedCaves.includes(cave)) {
      pathSum += getUniquePaths(cave, goalCave, visitedCaves, allowDoubleVisit);
    } else if (allowDoubleVisit && !cavesWithForbiddenDoubleVisit.includes(cave.caveName)) {
      // Double visit activated -> disable double visit for following iterations
      // (Can double visit only once)
      pathSum += getUniquePaths(cave, goalCave, visitedCaves, false);
    }
  }
  // Revert visitedCaves for next recursion iteration
  visitedCaves.pop();
  return pathSum;
}

console.log("Part 1", part1());
console.log("Part 2", part2());

