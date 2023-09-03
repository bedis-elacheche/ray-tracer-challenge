import { Tuple } from "./tuple";
import { Vector } from "./vector";

export class Point extends Tuple {
  public static readonly __name__ = "point";

  constructor(x: number, y: number, z: number) {
    super(x, y, z, 1);
  }

  serialize(): JSONObject {
    return { __type: Point.__name__, x: this.x, y: this.y, z: this.z };
  }

  static deserialize({ __type, x, y, z }: JSONObject) {
    if (__type === Point.__name__) {
      return new Point(+x, +y, +z);
    }

    throw new Error("Cannot deserialize object.");
  }

  static isPoint(tuple: Tuple): tuple is Point {
    return tuple.w === 1;
  }

  static from(tuple: Tuple) {
    return new Point(tuple.x, tuple.y, tuple.z);
  }

  subtract(t: Point): Vector;
  subtract(t: Vector): Point;
  subtract(t: Tuple): Tuple {
    const tuple = super.subtract(t);

    if (Vector.isVector(t)) {
      return new Point(tuple.x, tuple.y, tuple.z);
    }

    if (Point.isPoint(t)) {
      return new Vector(tuple.x, tuple.y, tuple.z);
    }

    return tuple;
  }

  add(t: Point): Tuple;
  add(t: Vector): Point;
  add(t: Tuple): Tuple {
    const tuple = super.add(t);

    if (Vector.isVector(t)) {
      return new Point(tuple.x, tuple.y, tuple.z);
    }

    return tuple;
  }
}
