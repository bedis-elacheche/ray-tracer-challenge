import { Point, Vector } from "../core";
import { Intersection, Ray } from "../engine";
import { Triangle, TriangleProps } from "./triangle";

export class SmoothTriangle extends Triangle {
  public static readonly __name__ = "smooth-triangle";
  public n1: Vector;
  public n2: Vector;
  public n3: Vector;
  public u: number;
  public v: number;

  constructor({
    n1,
    n2,
    n3,
    p1,
    p2,
    p3,
    origin,
    transform,
    material,
    parent,
    hasShadow,
  }: TriangleProps & {
    n1: Vector;
    n2: Vector;
    n3: Vector;
  }) {
    super({
      p1,
      p2,
      p3,
      origin,
      transform,
      material,
      parent,
      hasShadow,
    });

    this.n1 = n1;
    this.n2 = n2;
    this.n3 = n3;
  }

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      __type: SmoothTriangle.__name__,
      n1: this.n1.serialize(),
      n2: this.n2.serialize(),
      n3: this.n3.serialize(),
    };
  }

  static deserialize({ __type, n1, n2, n3, ...rest }: JSONObject) {
    if (__type === SmoothTriangle.__name__) {
      const { p1, p2, p3, origin, transform, material, parent, hasShadow } =
        Triangle.deserialize({
          __type: Triangle.__name__,
          ...rest,
        });

      return new SmoothTriangle({
        n1: Vector.deserialize(n1),
        n2: Vector.deserialize(n2),
        n3: Vector.deserialize(n3),
        p1,
        p2,
        p3,
        origin,
        transform,
        material,
        parent,
        hasShadow,
      });
    }

    throw new Error("Cannot deserialize object.");
  }

  localIntersect(localRay: Ray): Intersection<SmoothTriangle>[] {
    return this.mollerTrumboreIntersection(localRay, { smoothTriangle: true });
  }

  localNormalAt(_localPoint: Point, intersection: Intersection) {
    return this.n2
      .multiply(intersection.u)
      .add(this.n3.multiply(intersection.v))
      .add(this.n1.multiply(1 - intersection.u - intersection.v));
  }

  equals(s: SmoothTriangle) {
    if (this === s) {
      return true;
    }

    return (
      super.equals(s) &&
      this.n1.equals(s.n1) &&
      this.n2.equals(s.n2) &&
      this.n3.equals(s.n3) &&
      this.u === s.u &&
      this.v === s.v
    );
  }
}
