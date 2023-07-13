import { Tuple } from "./tuple";

export class Vector extends Tuple {
  constructor(x: number, y: number, z: number) {
    super(x, y, z, 0);
  }

  static isVector(tuple: Tuple): tuple is Vector {
    return tuple.w === 0;
  }

  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }

  normalize() {
    const magnitude = this.magnitude();

    return new Vector(
      this.x / magnitude,
      this.y / magnitude,
      this.z / magnitude
    );
  }

  dot(vector: Vector) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }

  cross(vector: Vector) {
    return new Vector(
      this.y * vector.z - this.z * vector.y,
      this.z * vector.x - this.x * vector.z,
      this.x * vector.y - this.y * vector.x
    );
  }
}
