import { EPSILON, Point, Vector } from "../core";
import { Intersection, Ray } from "../engine";
import { BoundingBox } from "./bounding-box";
import { Shape } from "./shape";

export class Plane extends Shape {
  public static readonly __name__ = "plane";

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      __type: Plane.__name__,
    };
  }

  static deserialize({ __type, ...rest }: JSONObject) {
    if (__type === Plane.__name__) {
      const { origin, transform, material, parent, hasShadow } =
        Shape.deserialize({
          __type: Shape.__name__,
          ...rest,
        });

      return new Plane({
        origin,
        transform,
        material,
        parent,
        hasShadow,
      });
    }

    throw new Error("Cannot deserialize object.");
  }

  get bounds() {
    if (!this._bounds) {
      this._bounds = new BoundingBox({
        min: new Point(-Infinity, 0, -Infinity),
        max: new Point(Infinity, 0, Infinity),
      });
    }

    return this._bounds;
  }

  localNormalAt(_localPoint: Point) {
    return new Vector(0, 1, 0);
  }

  localIntersect(localRay: Ray): Intersection<Plane>[] {
    if (Math.abs(localRay.direction.y) < EPSILON) {
      return [];
    }

    const t = -localRay.origin.y / localRay.direction.y;

    return [new Intersection(t, this)];
  }
}
