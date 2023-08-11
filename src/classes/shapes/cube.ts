import { Point, Vector } from "../core";
import { Intersection, Ray } from "../world";
import { Shape } from "./shape";

export class Cube extends Shape {
  localNormalAt(localPoint: Point) {
    const maxc = Math.max(
      Math.abs(localPoint.x),
      Math.abs(localPoint.y),
      Math.abs(localPoint.z),
    );

    switch (maxc) {
      case Math.abs(localPoint.x):
        return new Vector(localPoint.x, 0, 0);
      case Math.abs(localPoint.y):
        return new Vector(0, localPoint.y, 0);
      case Math.abs(localPoint.z):
        return new Vector(0, 0, localPoint.z);
    }
  }

  private static checkAxis(
    origin: number,
    direction: number,
  ): [number, number] {
    const tminNumerator = -1 - origin;
    const tmaxNumerator = 1 - origin;
    const tmin = tminNumerator / direction;
    const tmax = tmaxNumerator / direction;

    return tmin > tmax ? [tmax, tmin] : [tmin, tmax];
  }

  localIntersect(localRay: Ray): Intersection<Cube>[] {
    const [xtmin, xtmax] = Cube.checkAxis(
      localRay.origin.x,
      localRay.direction.x,
    );
    const [ytmin, ytmax] = Cube.checkAxis(
      localRay.origin.y,
      localRay.direction.y,
    );
    const [ztmin, ztmax] = Cube.checkAxis(
      localRay.origin.z,
      localRay.direction.z,
    );
    const tmin = Math.max(xtmin, ytmin, ztmin);
    const tmax = Math.min(xtmax, ytmax, ztmax);

    if (tmin > tmax) {
      return [];
    }

    return [new Intersection(tmin, this), new Intersection(tmax, this)];
  }
}
