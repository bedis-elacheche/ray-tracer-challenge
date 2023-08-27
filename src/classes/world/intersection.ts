import { Shape } from "../shapes";

export class Intersection<T extends Shape = Shape> {
  public t: number;
  public object: T;
  public u: number;
  public v: number;

  constructor(t: number, object: T, u?: number, v?: number) {
    this.t = t;
    this.object = object;
    this.u = u;
    this.v = v;
  }

  static hit(intersections: Intersection[]): Intersection | null {
    let hit: Intersection | null = null;

    for (const intersection of intersections) {
      if (intersection.t < 0) {
        continue;
      }

      if (!hit || hit.t > intersection.t) {
        hit = intersection;
      }
    }

    return hit;
  }

  equals(intersection: Intersection) {
    if (this === intersection) {
      return true;
    }

    return this.t === intersection.t && this.object.equals(intersection.object);
  }
}
