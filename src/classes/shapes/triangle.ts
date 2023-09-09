import { EPSILON, Point, Vector } from "../core";
import { Intersection, Ray } from "../engine";
import { Shape, ShapeProps } from "./shape";

export type TriangleProps = ShapeProps & {
  p1: Point;
  p2: Point;
  p3: Point;
};

export class Triangle extends Shape {
  public static __name__ = "triangle";
  protected _p1: Point;
  protected _p2: Point;
  protected _p3: Point;
  protected _e1: Vector;
  protected _e2: Vector;
  protected _normal: Vector;

  constructor({
    p1,
    p2,
    p3,
    origin,
    transform,
    material,
    parent,
    hasShadow,
  }: TriangleProps) {
    super({
      origin,
      transform,
      material,
      parent,
      hasShadow,
    });

    this._p1 = p1;
    this._p2 = p2;
    this._p3 = p3;

    this._e1 = p2.subtract(p1);
    this._e2 = p3.subtract(p1);
    this._normal = this._e2.cross(this._e1).normalize();
  }

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      __type: Triangle.__name__,
      p1: this._p1.serialize(),
      p2: this._p2.serialize(),
      p3: this._p3.serialize(),
    };
  }

  static deserialize({ __type, p1, p2, p3, ...rest }: JSONObject) {
    if (__type === Triangle.__name__) {
      const { origin, transform, material, parent, hasShadow } =
        Shape.deserialize({
          __type: Shape.__name__,
          ...rest,
        });

      return new Triangle({
        p1: Point.deserialize(p1),
        p2: Point.deserialize(p2),
        p3: Point.deserialize(p3),
        origin,
        transform,
        material,
        parent,
        hasShadow,
      });
    }

    throw new Error("Cannot deserialize object.");
  }

  private recalculate() {
    this._e1 = this._p2.subtract(this._p1);
    this._e2 = this._p3.subtract(this._p1);
    this._normal = this._e2.cross(this._e1).normalize();
  }

  get p1(): Point {
    return this._p1;
  }

  set p1(value: Point) {
    this._p1 = value;
    this.recalculate();
  }

  get p2(): Point {
    return this._p2;
  }

  set p2(value: Point) {
    this._p2 = value;
    this.recalculate();
  }

  get p3(): Point {
    return this._p3;
  }

  set p3(value: Point) {
    this._p3 = value;
    this.recalculate();
  }

  get e1(): Vector {
    return this._e1;
  }

  get e2(): Vector {
    return this._e2;
  }

  get normal(): Vector {
    return this._normal;
  }

  protected mollerTrumboreIntersection(
    localRay: Ray,
    { smoothTriangle }: { smoothTriangle: boolean },
  ) {
    const directionCrossE2 = localRay.direction.cross(this._e2);
    const determinant = this._e1.dot(directionCrossE2);

    if (Math.abs(determinant) < EPSILON) {
      return [];
    }

    const f = 1 / determinant;
    const p1ToOrigin = localRay.origin.subtract(this._p1);
    const u = f * p1ToOrigin.dot(directionCrossE2);

    if (u < 0 || u > 1) {
      return [];
    }

    const origin_CrossE1 = p1ToOrigin.cross(this._e1);
    const v = f * localRay.direction.dot(origin_CrossE1);

    if (v < 0 || u + v > 1) {
      return [];
    }

    const t = f * this._e2.dot(origin_CrossE1);

    return smoothTriangle
      ? [new Intersection(t, this, u, v)]
      : [new Intersection(t, this)];
  }

  localIntersect(localRay: Ray): Intersection<Triangle>[] {
    return this.mollerTrumboreIntersection(localRay, { smoothTriangle: false });
  }

  localNormalAt(_localPoint: Point, _intersection?: Intersection) {
    return this._normal;
  }

  equals(s: Triangle) {
    if (this === s) {
      return true;
    }

    return (
      super.equals(s) &&
      this._p1.equals(s._p1) &&
      this._p2.equals(s._p2) &&
      this._p3.equals(s._p3) &&
      this._e1.equals(s._e1) &&
      this._e2.equals(s._e2) &&
      this._normal.equals(s._normal)
    );
  }
}
