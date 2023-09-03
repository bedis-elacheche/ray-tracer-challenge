import { Point } from "../core";
import { Intersection, Ray } from "../engine";
import { Shape } from "./shape";

export class Sphere extends Shape {
  public static readonly __name__ = "sphere";

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      __type: Sphere.__name__,
    };
  }

  static deserialize({ __type, ...rest }: JSONObject) {
    if (__type === Sphere.__name__) {
      const { origin, transform, material, parent } = Shape.deserialize({
        __type: Shape.__name__,
        ...rest,
      });

      return new Sphere({
        origin,
        transform,
        material,
        parent,
      });
    }

    throw new Error("Cannot deserialize object.");
  }

  localNormalAt(localPoint: Point) {
    return localPoint.subtract(this.origin);
  }

  localIntersect(localRay: Ray): Intersection<Sphere>[] {
    const worldOrigin = new Point(0, 0, 0);
    const sphereToRay = localRay.origin.subtract(worldOrigin);
    const a = localRay.direction.dot(localRay.direction);
    const b = 2 * localRay.direction.dot(sphereToRay);
    const c = sphereToRay.dot(sphereToRay) - 1;
    const discriminant = b ** 2 - 4 * a * c;

    if (discriminant < 0) {
      return [];
    }

    return [
      new Intersection((-b - Math.sqrt(discriminant)) / (2 * a), this),
      new Intersection((-b + Math.sqrt(discriminant)) / (2 * a), this),
    ];
  }
}
