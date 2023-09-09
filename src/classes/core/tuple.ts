import { Serializable } from "./serializable";
import { isEqual } from "./utils";

export class Tuple implements Serializable {
  public static __name__ = "tuple";
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
    w: number,
  ): T {
    const TClass = this.constructor.prototype;

    return <T>new TClass(x, y, z, w);
  }

  serialize(): JSONObject {
    return {
      __type: Tuple.__name__,
      x: this.x,
      y: this.y,
      z: this.z,
      w: this.w,
    };
  }

  static deserialize({ __type, x, y, z, w }: JSONObject) {
    if (__type === Tuple.__name__) {
      return new Tuple(+x, +y, +z, +w);
    }

    throw new Error("Cannot deserialize object.");
  }

  add<T extends Tuple>(this: T, tuple: Tuple) {
    return <T>(
      new Tuple(
        this.x + tuple.x,
        this.y + tuple.y,
        this.z + tuple.z,
        this.w + tuple.w,
      )
    );
  }

  subtract(tuple: Tuple) {
    return new Tuple(
      this.x - tuple.x,
      this.y - tuple.y,
      this.z - tuple.z,
      this.w - tuple.w,
    );
  }

  multiply<T extends Tuple>(this: T, scalar: number): T {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new this.constructor(
      this.x * scalar,
      this.y * scalar,
      this.z * scalar,
      this.w * scalar,
    );
  }

  divide<T extends Tuple>(this: T, scalar: number): T {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new this.constructor(
      this.x / scalar,
      this.y / scalar,
      this.z / scalar,
      this.w / scalar,
    );
  }

  negate() {
    return this.multiply(-1);
  }

  dot(tuple: Tuple) {
    return (
      this.x * tuple.x + this.y * tuple.y + this.z * tuple.z + this.w * tuple.w
    );
  }

  equals(tuple: Tuple) {
    if (tuple === this) {
      return true;
    }

    return (
      isEqual(this.x, tuple.x) &&
      isEqual(this.y, tuple.y) &&
      isEqual(this.z, tuple.z) &&
      isEqual(this.w, tuple.w)
    );
  }

  static max(a: Tuple, b: Tuple) {
    return new Tuple(
      Math.max(a.x, b.x),
      Math.max(a.y, b.y),
      Math.max(a.z, b.z),
      Math.max(a.w, b.w),
    );
  }

  static min(a: Tuple, b: Tuple) {
    return new Tuple(
      Math.min(a.x, b.x),
      Math.min(a.y, b.y),
      Math.min(a.z, b.z),
      Math.min(a.w, b.w),
    );
  }
}
