import { Point, Vector } from "../core";
import { Intersection, Ray } from "../engine";
import { Triangle, TriangleProps } from "./triangle";

export class SmoothTriangle extends Triangle {
  public static readonly __name__ = "smooth-triangle";
  private _n1: Vector;
  private _n2: Vector;
  private _n3: Vector;
  private _u: number;
  private _v: number;

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

    this._n1 = n1;
    this._n2 = n2;
    this._n3 = n3;
  }

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      __type: SmoothTriangle.__name__,
      n1: this._n1.serialize(),
      n2: this._n2.serialize(),
      n3: this._n3.serialize(),
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

  get n1(): Vector {
    return this._n1;
  }

  set n1(value: Vector) {
    this._n1 = value;
  }

  get n2(): Vector {
    return this._n2;
  }

  set n2(value: Vector) {
    this._n2 = value;
  }

  get n3(): Vector {
    return this._n3;
  }

  set n3(value: Vector) {
    this._n3 = value;
  }

  get u(): number {
    return this._u;
  }

  set u(value: number) {
    this._u = value;
  }

  get v(): number {
    return this._v;
  }

  set v(value: number) {
    this._v = value;
  }

  localIntersect(localRay: Ray): Intersection<SmoothTriangle>[] {
    return this.mollerTrumboreIntersection(localRay, { smoothTriangle: true });
  }

  localNormalAt(_localPoint: Point, intersection: Intersection) {
    return this._n2
      .multiply(intersection.u)
      .add(this._n3.multiply(intersection.v))
      .add(this._n1.multiply(1 - intersection.u - intersection.v));
  }

  equals(s: SmoothTriangle) {
    if (this === s) {
      return true;
    }

    return (
      super.equals(s) &&
      this._n1.equals(s._n1) &&
      this._n2.equals(s._n2) &&
      this._n3.equals(s._n3) &&
      this._u === s._u &&
      this._v === s._v
    );
  }
}
