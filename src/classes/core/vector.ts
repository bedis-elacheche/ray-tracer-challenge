import { Tuple } from "./tuple";

export class Vector extends Tuple {
  public static readonly __name__ = "vector";

  constructor(x: number, y: number, z: number) {
    super(x, y, z, 0);
  }

  static isVector(tuple: Tuple): tuple is Vector {
    return tuple.w === 0;
  }

  static from(tuple: Tuple) {
    return new Vector(tuple.x, tuple.y, tuple.z);
  }

  serialize(): JSONObject {
    return { __type: Vector.__name__, x: this.x, y: this.y, z: this.z };
  }

  static deserialize({ __type, x, y, z }: JSONObject) {
    if (__type === Vector.__name__) {
      return new Vector(+x, +y, +z);
    }

    throw new Error("Cannot deserialize object.");
  }

  subtract(t: Tuple) {
    const { x, y, z } = super.subtract(t);

    return new Vector(x, y, z);
  }

  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }

  normalize() {
    const magnitude = this.magnitude();

    return new Vector(
      this.x / magnitude,
      this.y / magnitude,
      this.z / magnitude,
    );
  }

  cross(vector: Vector) {
    return new Vector(
      this.y * vector.z - this.z * vector.y,
      this.z * vector.x - this.x * vector.z,
      this.x * vector.y - this.y * vector.x,
    );
  }

  reflect(normal: Vector) {
    return this.subtract(normal.multiply(2 * this.dot(normal)));
  }
}
