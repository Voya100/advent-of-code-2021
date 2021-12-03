// https://adventofcode.com/2021/day/3
import * as fs from "fs";
import { sum } from './utils';

const input = fs.readFileSync("inputs/day3.txt", "utf8");
const inputRows = input.split("\n");

function part1() {
  const { gamma, epsilon } = getPowerValues(inputRows);
  return gamma * epsilon;
}

function part2() {
  const oxygenGeneratorRating = getOxygenGeneratorRating(inputRows);
  const scrubberRating = getScrubberRating(inputRows);
  return oxygenGeneratorRating * scrubberRating;
}

function getPowerValues(rows: string[]) {
  const mostCommon = mostCommonBits(rows);
  const leastCommon = inverse(mostCommon);

  const gamma = parseInt(mostCommon, 2);
  const epsilon = parseInt(leastCommon, 2);

  return { gamma, epsilon };
}

function mostCommonBits(rows: string[]) {
  const bitCount = rows[0].length;
  let mostCommon = '';
  for (let bitIndex = 0; bitIndex < bitCount; bitIndex++) {
    mostCommon += mostCommonBitValue(rows, bitIndex);
  }
  return mostCommon;
}

function mostCommonBitValue(rows: string[], bitIndex: number) {
  const middle = rows.length / 2;
  const oneCount = sum(rows, row => +row[bitIndex]);
  return oneCount < middle ? '0' : '1';
}

function leastCommonBitValue(rows: string[], bitIndex: number) {
  return mostCommonBitValue(rows, bitIndex) === '0' ? '1' : '0';
}

function inverse(binary: string) {
  return binary.split('').map(bit => bit === '0' ? '1' : '0').join('');
}

function getOxygenGeneratorRating(rows: string[]) {
  return getRating(rows, mostCommonBitValue);
}

function getScrubberRating(rows: string[]) {
  return getRating(rows, leastCommonBitValue);
}

function getRating(rows: string[], bitCriteriaFunction: (rows: string[], bitIndex: number) => string) {
  const bitCount = rows[0].length;
  for (let bitIndex = 0; bitIndex < bitCount; bitIndex++) {
    const bitCriteria = bitCriteriaFunction(rows, bitIndex);
    rows = rows.filter(row => row[bitIndex] === bitCriteria);
    if (rows.length === 1) {
      return parseInt(rows[0], 2);
    }
  }
}

console.log("Part 1", part1());
console.log("Part 2", part2());

