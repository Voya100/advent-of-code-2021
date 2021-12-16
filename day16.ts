// https://adventofcode.com/2021/day/16
import * as fs from "fs";
import { multiply, sum } from './utils';

const input = fs.readFileSync("inputs/day16.txt", "utf8");
const binary = input.split('').map(hexToBinary).join('');

enum Type {
  Sum = 0,
  Product = 1,
  Minimum = 2,
  Maximum = 3,
  Literal = 4,
  GreaterThan = 5,
  LessThan = 6,
  EqualTo = 7
}

enum LengthTypeId {
  LengthInBits = 0,
  NumberOfPackets = 1
}

const lengthTypeLengthsById = {
  0: 15,
  1: 11
}

function part1() {
  const reader = new BinaryReader();
  const rootPacket = reader.readPacket();
  const allPackets = getAllPackets(rootPacket);
  return sum(allPackets, packet => packet.version)
}

function part2() {
  const reader = new BinaryReader();
  const rootPacket = reader.readPacket();
  return evaluate(rootPacket);
}

interface Packet {
  version: number,
  type: Type,
  value?: number,
  packets: Packet[]
}

class BinaryReader {

  nextIndex = 0;
  packets = {};

  readPacket(): Packet {
    const version = this.readAsNumber(3);
    const type = this.readAsNumber(3);
    if (type === Type.Literal) {
      const value = this.readNumberLiteral();
      return {
        version, type, value, packets: []
      }
    }
    const packets = this.readOperatorPackets();
    return { version, type, packets };
  }

  readNumberLiteral() {
    const numberLength = 4;
    let moreBits = true;
    let numberBits = '';
    while (moreBits) {
      moreBits = this.read(1) === '1';
      numberBits += this.read(numberLength);
    }
    return Number.parseInt(numberBits, 2);
  }

  readOperatorPackets() {
    const lengthTypeId = this.readAsNumber(1) as LengthTypeId;
    const lengthTypeLength = lengthTypeLengthsById[lengthTypeId];
    const lengthValue = this.readAsNumber(lengthTypeLength);
    const startIndex = this.nextIndex;
    const packets: Packet[] = [];
    if (lengthTypeId === LengthTypeId.LengthInBits) {
      while (this.nextIndex < startIndex + lengthValue) {
        packets.push(this.readPacket());
      }
    } else {
      for (let i = 0; i < lengthValue; i++) {
        packets.push(this.readPacket());
      }
    }
    return packets;
  }

  read(length: number) {
    const value = binary.slice(this.nextIndex, this.nextIndex + length);
    this.nextIndex += length;
    return value;
  }

  readAsNumber(length: number) {
    return Number.parseInt(this.read(length), 2);
  }
}

function getAllPackets(rootPacket: Packet): Packet[] {
  if (rootPacket.packets.length === 0) {
    return [rootPacket];
  }
  return [rootPacket, ...rootPacket.packets.flatMap(getAllPackets)];
}

function hexToBinary(hex: string) {
  return Number.parseInt(hex, 16).toString(2).padStart(4, '0');
}

function evaluate(packet: Packet): number {
  switch (packet.type) {
    case Type.Sum:
      return sum(packet.packets, evaluate);
    case Type.Product:
      return multiply(packet.packets, evaluate);
    case Type.Minimum:
      return Math.min(...packet.packets.map(evaluate));
    case Type.Maximum:
      return Math.max(...packet.packets.map(evaluate));
    case Type.Literal:
      return packet.value;
    case Type.GreaterThan:
      return evaluate(packet.packets[0]) > evaluate(packet.packets[1]) ? 1 : 0
    case Type.LessThan:
      return evaluate(packet.packets[0]) < evaluate(packet.packets[1]) ? 1 : 0
    case Type.EqualTo:
      return evaluate(packet.packets[0]) === evaluate(packet.packets[1]) ? 1 : 0
    default:
      throw new Error('Invalid type');
  }
}

console.log("Part 1", part1());
console.log("Part 2", part2());
