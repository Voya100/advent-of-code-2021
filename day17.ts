// https://adventofcode.com/2021/day/17
import * as fs from "fs";
import { getRange } from "./utils";

const input = fs.readFileSync("inputs/day17.txt", "utf8");
const input2 = 'target area: x=20..30, y=-10..-5'

const [xStart, xEnd, yEnd, yStart] = input
  .match(/target area: x=(-?.+)\.\.(-?\d+), y=(-?\d+)\.\.(-?\d+)/)
  .slice(1)
  .map(value => +value);

function part1() {
  const highestYSpeed = Math.max(...getPossibleVelocities().map(([_, y]) => y));
  return getHighestY(highestYSpeed);
}

function part2() {
  const velocities = getPossibleVelocities();
  return velocities.length;
}

function getPossibleVelocities() {
  const xSpeedStepCombinations = getPossibleXSpeedsWithSteps();
  const velocities: [xSpeed: number, ySpeed: number][] = [];
  for (let { xStartSpeed, steps } of xSpeedStepCombinations) {
    const uniqueYSpeeds = new Set<number>();
    for (let step of steps) {
      const isSpeedZero = xStartSpeed <= step;
      const possibleYSpeeds = getPossibleYSpeeds(step, isSpeedZero);
      for (let speed of possibleYSpeeds) {
        uniqueYSpeeds.add(speed);
      }
    }
    for (let ySpeed of uniqueYSpeeds) {
      velocities.push([xStartSpeed, ySpeed])
    }
  }
  return velocities;
}

// Note: Assumes end target is on right side (xStart and xEnd are positive)
function getPossibleXSpeedsWithSteps() {
  const xSpeedStepCombinations: { xStartSpeed: number, steps: number[] }[] = [];
  // x must be able to reach xStart before speed becomes 0
  // x must also not skip entire range (xEnd) in single step
  const minXSpeed = Math.ceil(reverseSequenceSum(xStart));
  const maxXSpeed = xEnd;
  for (let xStartSpeed of getRange(minXSpeed, maxXSpeed + 1)) {
    let step = 0;
    let x = 0;
    const possibleXSteps: number[] = [];
    while (x <= xEnd && step <= xStartSpeed) {
      if (x >= xStart) {
        possibleXSteps.push(step);
      }
      step++;
      x = getXAtStep(xStartSpeed, step);
    }
    if (possibleXSteps.length) {
      xSpeedStepCombinations.push({ xStartSpeed, steps: possibleXSteps })
    }
  }
  return xSpeedStepCombinations;
}

function getPossibleYSpeeds(step: number, isXSpeedZero: boolean) {
  const minYSpeed = Math.ceil(getStartSpeedForYAtStep(yEnd, step));
  const maxYSpeed = Math.floor(getStartSpeedForYAtStep(yStart, step));
  const possibleSpeeds = [];
  // Speed must be integer
  if (minYSpeed <= maxYSpeed) {
    possibleSpeeds.push(...getRange(minYSpeed, maxYSpeed + 1));
  }
  if (!isXSpeedZero) {
    return possibleSpeeds;
  }

  // No more x speed, so probe will fall directly down => all following steps could be valid
  // Due to symmetry, if startSpeed is positive, it will have equal negative speed when it returns
  // to starting position height. Maximum speed can be value of yEnd
  for (let speed of getRange(maxYSpeed + 1, Math.abs(yEnd) + 1)) {
    // Steps must be complete
    const startStep = Math.ceil(getStepForYAtSpeed(yStart, speed));
    const endStep = Math.floor(getStepForYAtSpeed(yEnd, speed));
    if (startStep <= endStep) {
      possibleSpeeds.push(speed);
    }
  }
  return possibleSpeeds;
}

/**
 * y value for step at some startSpeed can be calculated with
 * sequenceSum(startSpeed) - sequenceSum(step - startSpeed - 1)
 * 
 * With this formula it is possible solve start speed for known y and step
 * with the power of math.
 */
function getStartSpeedForYAtStep(y: number, step: number) {
  return (2 * y + (step - 1) ** 2 + step - 1) / (2 * step);
}

/**
 * Formula determined from getStartSpeedForYAtStep + math
 */
function getStepForYAtSpeed(y: number, ySpeed: number) {
  return ySpeed + 1 / 2 + Math.sqrt(ySpeed ** 2 + ySpeed - 2 * y + 1 / 4);
}

function getHighestY(startSpeed: number) {
  return sequenceSum(startSpeed);
}

function getXAtStep(startSpeed: number, step: number) {
  return sequenceSum(startSpeed) - sequenceSum(startSpeed - step)
}

function sequenceSum(n: number) {
  return n * (n + 1) / 2;
}

/**
 * Solve n from sequenceSum(n) === sum
 */
function reverseSequenceSum(sum: number) {
  return (Math.sqrt(1 + 8 * sum) - 1) / 2;
}

console.log("Part 1", part1());
console.log("Part 2", part2());
