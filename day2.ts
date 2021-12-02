// https://adventofcode.com/2021/day/2
import * as fs from "fs";
import { sum } from "./utils";

const input = fs.readFileSync("inputs/day2.txt", "utf8");
const commands = input.split("\n")
  .map(row => {
    const [commandName, value] = row.split(' ');
    return { commandName, value: +value }
  });

const FORWARD = "forward";
const DOWN = "down";
const UP = "up";

function part1() {
  const forwardSum = commandSum(FORWARD);
  const depthSum = commandSum(DOWN) - commandSum(UP);
  return forwardSum * depthSum;
}

function part2() {
  let aim = 0;
  let depth = 0;
  let forward = 0;
  for (let command of commands) {
    switch (command.commandName) {
      case FORWARD:
        forward += command.value;
        depth += aim * command.value;
        break;
      case DOWN:
        aim += command.value;
        break;
      case UP:
        aim -= command.value;
        break;
      default:
        throw new Error(`Invalid command {command.commandName}`);
    }
  }
  return forward * depth;
}

function commandSum(commandName: string) {
  const values = commands.filter(command => command.commandName === commandName);
  return sum(values, v => v.value);
}


console.log("Part 1", part1());
console.log("Part 2", part2());

