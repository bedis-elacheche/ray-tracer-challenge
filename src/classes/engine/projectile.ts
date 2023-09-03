import { Point, Serializable, Vector } from "../core";

export class Projectile implements Serializable {
  public static readonly __name__ = "projectile";
  public position: Point;
  public velocity: Vector;

  constructor(p: Point, v: Vector) {
    this.position = p;
    this.velocity = v;
  }

  serialize(): JSONObject {
    return {
      __type: Projectile.__name__,
      position: this.position.serialize(),
      velocity: this.velocity.serialize(),
    };
  }

  static deserialize({ __type, position, velocity }: JSONObject) {
    if (__type === Projectile.__name__) {
      return new Projectile(
        Point.deserialize(position),
        Vector.deserialize(velocity),
      );
    }

    throw new Error("Cannot deserialize object.");
  }
}
