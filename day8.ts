// https://adventofcode.com/2021/day/8
import * as fs from "fs";
import { ExtendedSet, sum } from './utils';

const input = fs.readFileSync("inputs/day8.txt", "utf8");

const entries = input.split('\n')
  .map(
    row => row.split(' | ').map(
      entryPart => entryPart.split(' ')
    ) as [sequences: string[], output: string[]]
  );

const numberSegmentsByNumber = {
  0: 'abcefg',
  1: 'cf',
  2: 'acdeg',
  3: 'acdfg',
  4: 'bcdf',
  5: 'abdfg',
  6: 'abdefg',
  7: 'acf',
  8: 'abcdefg',
  9: 'abcdfg'
}

const orderedSequences = [...Object.values(numberSegmentsByNumber)]

const allSegments = numberSegmentsByNumber[8];

const segmentsBySequenceLength: Record<number, ExtendedSet<string>> = {};
for (let segment of Object.values(numberSegmentsByNumber)) {
  if (!segmentsBySequenceLength[segment.length]) {
    segmentsBySequenceLength[segment.length] = new ExtendedSet();
  }
  segmentsBySequenceLength[segment.length] = segmentsBySequenceLength[segment.length].union(segment.split(''))
}

function part1() {
  const segmentCounts = {
    1: 2,
    4: 4,
    7: 3,
    8: 7
  };
  const simpleNumbers: (keyof typeof segmentCounts)[] = [1, 4, 7, 8];
  const simpleNumberLengths = simpleNumbers.map(number => segmentCounts[number]);
  let count = 0;
  for (const [_, output] of entries) {
    count += output.filter(pattern => simpleNumberLengths.includes(pattern.length)).length;
  }
  return count;
}

function part2() {
  return sum(entries, entry => decodeEntry(entry));
}

function decodeEntry(entry: [sequences: string[], output: string[]]) {
  let sequences = entry.flat();

  // Handles initial filtering for possible solutions
  const possibleSolutionsBySegment = initPossibleSolutions(sequences);

  const solutionMap = findSolution(allSegments.split(''), allSegments.split(''), {});
  const realOutput = entry[1].map(sequence => translateSequence(sequence, solutionMap));
  return sequencesToNumber(realOutput);

  // Recursive "brute force" solution with some optimisations to ignore unnecessary paths
  // The number of possible combinations is limited when considering optimisations, so should be suitably performant
  // for this purpose
  function findSolution(segmentsToResolve: string[], remainingSolutions: string[], segmentMap: Record<string, string>): Record<string, string> | null {
    if (segmentsToResolve.length === 0) {
      return isSolution(segmentMap) ? segmentMap : null;
    }
    const segmentToResolve = segmentsToResolve.pop();
    const possibleSolutions = possibleSolutionsBySegment.get(segmentToResolve).intersect(remainingSolutions);
    if (possibleSolutions.size === 0) {
      segmentsToResolve.push(segmentToResolve);
      return null;
    }
    for (let possibleSolution of possibleSolutions) {
      const remainingSolutions2 = remainingSolutions.filter(segment => segment !== possibleSolution);
      const solution = findSolution(segmentsToResolve, remainingSolutions2, { ...segmentMap, [segmentToResolve]: possibleSolution });
      if (solution !== null) {
        return solution;
      }
    }
    // No solution for provided arguments
    segmentsToResolve.push(segmentToResolve);
    return null;
  }

  function isSolution(segmentMap: Record<string, string>) {
    return sequences.every(sequence => orderedSequences.includes(translateSequence(sequence, segmentMap)));
  }
}

function initPossibleSolutions(sequences: string[]) {
  const possibleConnections = new Map<string, ExtendedSet<string>>();
  for (let segment of allSegments) {
    possibleConnections.set(segment, new ExtendedSet(allSegments.split('')));
  }

  for (let sequence of sequences) {
    for (const segment of sequence) {
      possibleConnections.set(segment, possibleConnections.get(segment).intersect(segmentsBySequenceLength[sequence.length]));
    }
  }
  return possibleConnections;
}

function translateSequence(sequence: string, segmentMap: Record<string, string>) {
  return sequence.split('').map(segment => segmentMap[segment]).sort().join('');
}

function sequencesToNumber(sequences: string[]) {
  return parseInt(sequences.map(sequenceToNumber).join(''));
}

function sequenceToNumber(sequence: string) {
  return Object.entries(numberSegmentsByNumber).filter(([_, numberSequence]) => sequence === numberSequence)[0][0];
}

console.log("Part 1", part1());
console.log("Part 2", part2());
