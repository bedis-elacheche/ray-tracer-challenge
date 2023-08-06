import { EPSILON, Point, Vector } from "../core";
import { Intersection, Ray } from "../world";
import { Shape } from "./shape";

export class Plane extends Shape {
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
