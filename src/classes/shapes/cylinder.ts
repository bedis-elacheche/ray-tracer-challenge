import { EPSILON, Point, Vector } from "../core";
import { Intersection, Ray } from "../engine";
import { Shape, ShapeProps } from "./shape";

export class Cylinder extends Shape {
  public static readonly __name__ = "cylinder";

  public maximum: number;
  public minimum: number;
  public closed: boolean;

  constructor({
    origin,
    transform,
    material,
    parent,
    hasShadow,
    minimum = -Infinity,
    maximum = Infinity,
    closed = false,
  }: ShapeProps & {
    minimum?: number;
    maximum?: number;
    closed?: boolean;
  } = {}) {
    super({ hasShadow, origin, transform, material, parent });

    this.minimum = minimum;
    this.maximum = maximum;
    this.closed = closed;
  }

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      __type: Cylinder.__name__,
      minimum: this.minimum,
      maximum: this.maximum,
      closed: this.closed,
    };
  }

  static deserialize({
    __type,
    minimum,
    maximum,
    closed,
    ...rest
  }: JSONObject) {
    if (__type === Cylinder.__name__) {
      const { origin, transform, material, parent, hasShadow } =
        Shape.deserialize({
          __type: Shape.__name__,
          ...rest,
        });

      return new Cylinder({
        minimum: +minimum,
        maximum: +maximum,
        closed: !!closed,
        origin,
        transform,
        material,
        parent,
        hasShadow,
      });
    }

    throw new Error("Cannot deserialize object.");
  }

  localNormalAt(localPoint: Point) {
    const dist = localPoint.x ** 2 + localPoint.z ** 2;

    if (dist < 1) {
      if (Math.abs(localPoint.y - this.maximum) <= EPSILON) {
        return new Vector(0, 1, 0);
      }

      if (Math.abs(localPoint.y - this.minimum) <= EPSILON) {
        return new Vector(0, -1, 0);
      }
    }

    return new Vector(localPoint.x, 0, localPoint.z);
  }

  localIntersect(localRay: Ray): Intersection<Cylinder>[] {
    return [
      ...this.intersectWalls(localRay),
      ...this.intersectCaps(localRay),
    ].sort((a, z) => a.t - z.t);
  }

  private intersectWalls(localRay: Ray): Intersection<Cylinder>[] {
    const a = localRay.direction.x ** 2 + localRay.direction.z ** 2;

    if (Math.abs(a) <= EPSILON) {
      return [];
    }

    const b =
      2 * localRay.origin.x * localRay.direction.x +
      2 * localRay.origin.z * localRay.direction.z;
    const c = localRay.origin.x ** 2 + localRay.origin.z ** 2 - 1;
    const discriminant = b ** 2 - 4 * a * c;

    if (discriminant < 0) {
      return [];
    }

    return [
      (-b - Math.sqrt(discriminant)) / (2 * a),
      (-b + Math.sqrt(discriminant)) / (2 * a),
    ].reduce<Intersection<Cylinder>[]>((intersections, t) => {
      const y = localRay.origin.y + t * localRay.direction.y;

      if (this.minimum < y && y < this.maximum) {
        intersections.push(new Intersection(t, this));
      }

      return intersections;
    }, []);
  }

  private static checkCap(localRay: Ray, t: number) {
    const x = localRay.origin.x + t * localRay.direction.x;
    const z = localRay.origin.z + t * localRay.direction.z;

    return x ** 2 + z ** 2 - 1 <= EPSILON;
  }

  private intersectCaps(localRay: Ray): Intersection<Cylinder>[] {
    if (!this.closed || Math.abs(localRay.direction.y) <= EPSILON) {
      return [];
    }

    return [this.minimum, this.maximum].reduce<Intersection<Cylinder>[]>(
      (intersections, b) => {
        const t = (b - localRay.origin.y) / localRay.direction.y;

        if (Cylinder.checkCap(localRay, t)) {
          intersections.push(new Intersection(t, this));
        }

        return intersections;
      },
      [],
    );
  }

  equals(s: Cylinder) {
    if (this === s) {
      return true;
    }

    return (
      super.equals(s) &&
      this.minimum === s.minimum &&
      this.maximum === s.maximum &&
      this.closed === s.closed
    );
  }
}
