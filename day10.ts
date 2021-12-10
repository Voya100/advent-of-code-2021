// https://adventofcode.com/2021/day/10
import * as fs from "fs";
import { median, sum } from './utils';

const input = fs.readFileSync("inputs/day10.txt", "utf8");

type BracketSymbol = '(' | ')' | '[' | ']' | '{' | '}' | '<' | '>'

const lines = input.split("\n").map(row => row.split('') as BracketSymbol[]);

class SyntaxError extends Error {
  constructor(public wrongClosingSymbol: BracketSymbol) {
    super();
  }
}

const syntaxErrorscoreMap: Record<string, number> = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
}

const autoCompleteScoreMap: Record<string, number> = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
}

const openSymbols = ['(', '[', '{', '<'];

const bracketMatches = {
  ')': '(',
  ']': '[',
  '}': '{',
  '>': '<',
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>'
}

function part1() {
  return sum(lines, getSyntaxErrorScore);
}

function part2() {
  const scores = lines.map(getAutocompleteScore).filter(score => score !== 0);
  return median(scores);
}

function getSyntaxErrorScore(line: BracketSymbol[]) {
  try {
    getOpenBrackets(line);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return syntaxErrorscoreMap[error.wrongClosingSymbol];
    } else {
      throw error;
    }
  }
  // No syntax errors
  return 0;
}

function getOpenBrackets(line: BracketSymbol[]) {
  const openBrackets: BracketSymbol[] = [];
  for (let char of line) {
    if (openSymbols.includes(char)) {
      openBrackets.push(char);
    } else {
      // Closing symbol
      if (openBrackets[openBrackets.length - 1] === bracketMatches[char]) {
        openBrackets.pop();
      } else {
        throw new SyntaxError(char);
      }
    }
  }
  return openBrackets;
}

function getAutocompleteScore(line: BracketSymbol[]) {
  try {
    const openBrackets = getOpenBrackets(line);
    const closingBrackets = getClosingBrackets(openBrackets);
    let score = 0;
    for (let bracket of closingBrackets) {
      score *= 5;
      score += autoCompleteScoreMap[bracket];
    }
    return score;
  } catch (error) {
    return 0;
  }
}

function getClosingBrackets(openBrackets: BracketSymbol[]) {
  return openBrackets.reverse().map(bracket => bracketMatches[bracket]);
}

console.log("Part 1", part1());
console.log("Part 2", part2());
