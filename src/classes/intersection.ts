import { Shape } from "./shape";

export class Intersection {
  public t: number;
  public object: Shape;

  constructor(t: number, object: Shape) {
    this.t = t;
    this.object = object;
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
