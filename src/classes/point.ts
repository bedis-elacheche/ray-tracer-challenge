import { Tuple } from "./tuple";
import { Vector } from "./vector";

export class Point extends Tuple {
  constructor(x: number, y: number, z: number) {
    super(x, y, z, 1);
  }

  static isPoint(tuple: Tuple): tuple is Point {
    return tuple.w === 1;
  }

  static from(tuple: Tuple) {
    return new Point(tuple.x, tuple.y, tuple.z);
  }

  subtract<T extends Tuple>(
    t: T
  ): T extends Point ? Vector : T extends Vector ? Point : Tuple {
    const tuple = super.subtract(t);

    if (Vector.isVector(t)) {
      return new Point(tuple.x, tuple.y, tuple.z) as any;
    }

    if (Point.isPoint(t)) {
      return new Vector(tuple.x, tuple.y, tuple.z) as any;
    }

    return tuple as any;
  }
}
