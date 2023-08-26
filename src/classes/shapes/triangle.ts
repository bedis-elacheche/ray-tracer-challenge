import { EPSILON, Point, Vector } from "../core";
import { Intersection, Ray } from "../world";
import { Shape, ShapeProps } from "./shape";

export class Triangle extends Shape {
  public p1: Point;
  public p2: Point;
  public p3: Point;
  public e1: Vector;
  public e2: Vector;
  public normal: Vector;

  constructor({
    p1,
    p2,
    p3,
    origin,
    transform,
    material,
    parent,
  }: ShapeProps & {
    p1: Point;
    p2: Point;
    p3: Point;
  }) {
    super({ origin, transform, material, parent });
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;

    this.e1 = p2.subtract(p1);
    this.e2 = p3.subtract(p1);
    this.normal = this.e2.cross(this.e1).normalize();
  }

  localIntersect(localRay: Ray): Intersection<Triangle>[] {
    const directionCrossE2 = localRay.direction.cross(this.e2);
    const determinant = this.e1.dot(directionCrossE2);

    if (Math.abs(determinant) < EPSILON) {
      return [];
    }

    const f = 1 / determinant;
    const p1ToOrigin = localRay.origin.subtract(this.p1);
    const u = f * p1ToOrigin.dot(directionCrossE2);

    if (u < 0 || u > 1) {
      return [];
    }

    const origin_CrossE1 = p1ToOrigin.cross(this.e1);
    const v = f * localRay.direction.dot(origin_CrossE1);

    if (v < 0 || u + v > 1) {
      return [];
    }

    const t = f * this.e2.dot(origin_CrossE1);

    return [new Intersection(t, this)];
  }

  localNormalAt(_localPoint: Point) {
    return this.normal;
  }
}
