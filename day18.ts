// https://adventofcode.com/2021/day/18
import * as fs from "fs";

const input = fs.readFileSync("inputs/day18.txt", "utf8");

type Pair = [x: Pair | number, y: Pair | number];

const pairs = input.split('\n').map(row => JSON.parse(row) as Pair);

function part1() {
  let pair = pairs[0];
  for (let pair2 of pairs.slice(1)) {
    pair = addPairs(pair, pair2);
  }
  return getMagnitude(pair);
}

function part2() {
  let maxMagnitude = -Infinity;
  for (let i = 0; i < pairs.length; i++) {
    for (let j = i + 1; j < pairs.length; j++) {
      maxMagnitude = Math.max(
        maxMagnitude,
        getMagnitude(addPairs(pairs[i], pairs[j])),
        getMagnitude(addPairs(pairs[j], pairs[i]))
      )
    }
  }
  return maxMagnitude;
}

function addPairs(pair1: Pair, pair2: Pair) {
  return reducePair([pair1, pair2])
}

function reducePair(pair: Pair) {
  while (true) {
    const explodeResult = explodePairs(pair);
    pair = explodeResult.pair as Pair;
    if (explodeResult.action !== 'none') {
      continue;
    }
    const splitResult = splitPairs(pair);
    pair = splitResult.pair as Pair;
    if (splitResult.action !== 'none') {
      continue;
    }
    break;
  }
  return pair;
}

type ExplodeResult = {
  action: 'explode',
  pair: Pair | number,
  explodeLeft: number,
  explodeRight: number
}

type SplitAction = {
  action: 'split',
  pair: Pair | number
}

type NoAction = {
  action: 'none',
  pair: Pair | number
}

function explodePairs(pair: Pair | number, depth = 0): ExplodeResult | NoAction {
  if (isNumber(pair)) {
    return {
      action: 'none',
      pair
    }
  }
  if (depth === 4) {
    return {
      action: 'explode',
      pair: 0,
      explodeLeft: pair[0] as number,
      explodeRight: pair[1] as number
    }
  }
  const [leftValue, rightValue] = pair;
  const explodeLeft = explodePairs(leftValue, depth + 1);
  if (explodeLeft.action === 'explode') {
    return {
      action: 'explode',
      pair: [explodeLeft.pair, addLeft(rightValue, explodeLeft.explodeRight)],
      explodeLeft: explodeLeft.explodeLeft,
      explodeRight: 0
    }
  }
  const explodeRight = explodePairs(rightValue, depth + 1);
  if (explodeRight.action === 'explode') {
    return {
      action: 'explode',
      pair: [addRight(leftValue, explodeRight.explodeLeft), explodeRight.pair],
      explodeLeft: 0,
      explodeRight: explodeRight.explodeRight
    }
  }
  return {
    action: 'none',
    pair
  }
}

function splitPairs(pair: Pair | number): SplitAction | NoAction {
  if (isNumber(pair)) {
    if (pair > 9) {
      return {
        action: 'split',
        pair: [Math.floor(pair / 2), Math.ceil(pair / 2)]
      }
    }
    return {
      action: 'none',
      pair
    }
  }

  const split1 = splitPairs(pair[0]);
  if (split1.action === 'split') {
    return {
      action: 'split',
      pair: [split1.pair, pair[1]]
    }
  }
  const split2 = splitPairs(pair[1]);
  if (split2.action === 'split') {
    return {
      action: 'split',
      pair: [pair[0], split2.pair]
    }
  }
  return {
    action: 'none',
    pair
  }
}

function addLeft(pair: Pair | number, value: number): Pair | number {
  if (!value) {
    return pair;
  }
  if (isNumber(pair)) {
    return pair + value;
  }
  return [addLeft(pair[0], value), pair[1]];
}

function addRight(pair: Pair | number, value: number): Pair | number {
  if (!value) {
    return pair;
  }
  if (isNumber(pair)) {
    return pair + value;
  }
  return [pair[0], addRight(pair[1], value)];
}

function isNumber(pair: Pair | number): pair is number {
  return typeof pair === 'number';
}

function getMagnitude(pair: Pair | number): number {
  if (isNumber(pair)) {
    return pair;
  }
  return 3 * getMagnitude(pair[0]) + 2 * getMagnitude(pair[1]);
}

console.log("Part 1", part1());
console.log("Part 2", part2());
