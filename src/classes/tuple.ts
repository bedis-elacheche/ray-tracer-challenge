import { EPSILON } from "../constants";

export class Tuple {
  public x: number;
  public y: number;
  public z: number;
  public w: number;

  constructor(x: number, y: number, z: number, w: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
  public static create<T extends Tuple>(
    x: number,
    y: number,
    z: number,
    w: number
  ): T {
    let TClass = this.constructor.prototype;

    return <T>new TClass(x, y, z, w);
  }

  add<T extends Tuple>(this: T, tuple: Tuple) {
    return <T>(
      new Tuple(
        this.x + tuple.x,
        this.y + tuple.y,
        this.z + tuple.z,
        this.w + tuple.w
      )
    );
  }

  subtract<T extends Tuple>(this: T, tuple: Tuple) {
    return <T>(
      new Tuple(
        this.x - tuple.x,
        this.y - tuple.y,
        this.z - tuple.z,
        this.w - tuple.w
      )
    );
  }

  multiply<T extends Tuple>(this: T, scalar: number) {
    return <T>(
      new Tuple(
        this.x * scalar,
        this.y * scalar,
        this.z * scalar,
        this.w * scalar
      )
    );
  }

  divide<T extends Tuple>(this: T, scalar: number) {
    return <T>(
      new Tuple(
        this.x / scalar,
        this.y / scalar,
        this.z / scalar,
        this.w / scalar
      )
    );
  }

  negate<T extends Tuple>(this: T) {
    return this.multiply<T>(-1);
  }

  equals(tuple: Tuple) {
    return (
      Math.abs(this.x - tuple.x) <= EPSILON &&
      Math.abs(this.y - tuple.y) <= EPSILON &&
      Math.abs(this.z - tuple.z) <= EPSILON &&
      Math.abs(this.w - tuple.w) <= EPSILON
    );
  }
}
