import { Point } from "../core";
import { Intersection, Ray } from "../world";
import { Shape } from "./shape";

export class Sphere extends Shape {
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
