import { Tuple } from "./tuple";
import { Vector } from "./vector";

export class Point extends Tuple {
  constructor(x: number, y: number, z: number) {
    super(x, y, z, 1);
  }

  static isPoint(tuple: Tuple): tuple is Point {
    return tuple.w === 1;
  }

  subtract(t: Tuple): Point | Vector {
    const { x, y, z, w } = super.subtract(t);

    return w === 1 ? new Point(x, y, z) : new Vector(x, y, z);
  }
}
