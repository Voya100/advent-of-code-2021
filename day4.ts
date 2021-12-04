// https://adventofcode.com/2021/day/4
import * as fs from "fs";
import { sum } from "./utils";

const input = fs.readFileSync("inputs/day4.txt", "utf8");

const sections = input.split('\n\n');

const numbersInput = sections[0].split(',').map(value => +value);
const boardNumbersInput = sections.slice(1).map(
  boardStr => boardStr.split('\n').map(
    rowStr => rowStr.trim().split(/\s+/).map(value => +value)
  )
);

class Board {
  constructor(private boardNumbers: number[][]) { }

  isWinner(numbers: number[]): boolean {
    const matchGrid = this.boardNumbers.map(
      row => row.map(
        cell => numbers.includes(cell)
      )
    );
    for (let i = 0; i < matchGrid.length; i++) {
      if (this.isRowWinner(matchGrid, i) || this.isColumnWinner(matchGrid, i)) {
        return true;
      }
    }
    return false;
  }

  getWinnerValue(numbers: number[]) {
    const remainingNumbers = this.boardNumbers.flat().filter(number => !numbers.includes(number));
    return sum(remainingNumbers, number => number);
  }

  private isRowWinner(matchGrid: boolean[][], index: number) {
    return matchGrid[index].every(value => value);
  }

  private isColumnWinner(matchGrid: boolean[][], index: number) {
    return matchGrid.every(row => row[index])
  }

  toString() {
    return this.boardNumbers.map(row => row.join(' ')).join('\n');
  }
}

const boards = boardNumbersInput.map(boardNumbers => new Board(boardNumbers));

function part1() {
  const selectedNumbers: number[] = [];
  for (let number of numbersInput) {
    selectedNumbers.push(number);
    const winnerBoard = boards.find(board => board.isWinner(selectedNumbers));
    if (winnerBoard) {
      return winnerBoard.getWinnerValue(selectedNumbers) * number;
    }
  }
}

function part2() {
  const selectedNumbers: number[] = [];
  let boardsInGame: Board[] = boards;
  // lastBoard will get a board from the last round
  let lastBoard = boardsInGame[0];
  for (let number of numbersInput) {
    selectedNumbers.push(number);
    lastBoard = boardsInGame[0];
    boardsInGame = boardsInGame.filter(board => !board.isWinner(selectedNumbers));
    if (boardsInGame.length === 0) {
      // Every board has won.
      return lastBoard.getWinnerValue(selectedNumbers) * number;
    }
  }
}

console.log("Part 1", part1());
console.log("Part 2", part2());

