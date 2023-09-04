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
    hasShadow,
  }: TriangleProps) {
    super({
      origin,
      transform,
      material,
      parent,
      hasShadow,
    });

    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;

    this.e1 = p2.subtract(p1);
    this.e2 = p3.subtract(p1);
    this.normal = this.e2.cross(this.e1).normalize();
  }

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      __type: Triangle.__name__,
      p1: this.p1.serialize(),
      p2: this.p2.serialize(),
      p3: this.p3.serialize(),
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

  protected mollerTrumboreIntersection(
    localRay: Ray,
    { smoothTriangle }: { smoothTriangle: boolean },
  ) {
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

    return smoothTriangle
      ? [new Intersection(t, this, u, v)]
      : [new Intersection(t, this)];
  }

  localIntersect(localRay: Ray): Intersection<Triangle>[] {
    return this.mollerTrumboreIntersection(localRay, { smoothTriangle: false });
  }

  localNormalAt(_localPoint: Point, _intersection?: Intersection) {
    return this.normal;
  }

  equals(s: Triangle) {
    if (this === s) {
      return true;
    }

    return (
      super.equals(s) &&
      this.p1.equals(s.p1) &&
      this.p2.equals(s.p2) &&
      this.p3.equals(s.p3) &&
      this.e1.equals(s.e1) &&
      this.e2.equals(s.e2) &&
      this.normal.equals(s.normal)
    );
  }
}
