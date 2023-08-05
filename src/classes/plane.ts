import { EPSILON } from "../constants";
import { Intersection } from "./intersection";
import { Point } from "./point";
import { Ray } from "./ray";
import { Shape } from "./shape";
import { Vector } from "./vector";

export class Plane extends Shape {
  localNormalAt(localPoint: Point) {
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
