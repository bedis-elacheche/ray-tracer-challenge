import { Matrix, Point, Serializable, Vector } from "../core";

export class Ray implements Serializable {
  public static readonly __name__ = "ray";
  public origin: Point;
  public direction: Vector;

  constructor(origin: Point, direction: Vector) {
    this.origin = origin;
    this.direction = direction;
  }

  serialize(): JSONObject {
    return {
      __type: Ray.__name__,
      origin: this.origin.serialize(),
      direction: this.direction.serialize(),
    };
  }

  static deserialize({ __type, origin, direction }: JSONObject) {
    if (__type === Ray.__name__) {
      return new Ray(Point.deserialize(origin), Vector.deserialize(direction));
    }

    throw new Error("Cannot deserialize object.");
  }

  position(time: number) {
    return this.origin.add(this.direction.multiply(time));
  }

  transform(matrix: Matrix) {
    return new Ray(
      matrix.multiply(this.origin),
      matrix.multiply(this.direction),
    );
  }
}
