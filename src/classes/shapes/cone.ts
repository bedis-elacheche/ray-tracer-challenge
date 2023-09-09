import { EPSILON, Point, Vector } from "../core";
import { Intersection, Ray } from "../engine";
import { Shape, ShapeProps } from "./shape";

export class Cone extends Shape {
  public static readonly __name__ = "cone";
  private _maximum: number;
  private _minimum: number;
  private _closed: boolean;

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
    super({ origin, transform, material, parent, hasShadow });

    this._minimum = minimum;
    this._maximum = maximum;
    this._closed = closed;
  }

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      __type: Cone.__name__,
      minimum: this._minimum,
      maximum: this._maximum,
      closed: this._closed,
    };
  }

  static deserialize({
    __type,
    minimum,
    maximum,
    closed,
    ...rest
  }: JSONObject) {
    if (__type === Cone.__name__) {
      const { origin, transform, material, parent, hasShadow } =
        Shape.deserialize({
          __type: Shape.__name__,
          ...rest,
        });

      return new Cone({
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

  get minimum() {
    return this._minimum;
  }

  set minimum(value: number) {
    this._minimum = value;
  }

  get maximum() {
    return this._maximum;
  }

  set maximum(value: number) {
    this._maximum = value;
  }

  get closed() {
    return this._closed;
  }

  set closed(value: boolean) {
    this._closed = value;
  }

  localNormalAt(localPoint: Point) {
    const dist = localPoint.x ** 2 + localPoint.z ** 2;

    if (dist < 1) {
      if (Math.abs(localPoint.y - this._maximum) <= EPSILON) {
        return new Vector(0, 1, 0);
      }

      if (Math.abs(localPoint.y - this._minimum) <= EPSILON) {
        return new Vector(0, -1, 0);
      }
    }

    const y = Math.sqrt(dist) * (localPoint.y > 0 ? -1 : 1);

    return new Vector(localPoint.x, y, localPoint.z);
  }

  localIntersect(localRay: Ray): Intersection<Cone>[] {
    return [
      ...this.intersectWalls(localRay),
      ...this.intersectCaps(localRay),
    ].sort((a, z) => a.t - z.t);
  }

  private intersectWalls(localRay: Ray): Intersection<Cone>[] {
    const a =
      localRay.direction.x ** 2 -
      localRay.direction.y ** 2 +
      localRay.direction.z ** 2;
    const b =
      2 * localRay.origin.x * localRay.direction.x -
      2 * localRay.origin.y * localRay.direction.y +
      2 * localRay.origin.z * localRay.direction.z;
    const c =
      localRay.origin.x ** 2 - localRay.origin.y ** 2 + localRay.origin.z ** 2;

    if (Math.abs(a) <= EPSILON) {
      if (Math.abs(b) <= EPSILON) {
        return [];
      }

      const t = -c / (2 * b);

      return [new Intersection(t, this)];
    }

    const discriminant = b ** 2 - 4 * a * c;

    if (discriminant < 0) {
      return [];
    }

    return [
      (-b - Math.sqrt(discriminant)) / (2 * a),
      (-b + Math.sqrt(discriminant)) / (2 * a),
    ].reduce<Intersection<Cone>[]>((intersections, t) => {
      const y = localRay.origin.y + t * localRay.direction.y;

      if (this._minimum < y && y < this._maximum) {
        intersections.push(new Intersection(t, this));
      }

      return intersections;
    }, []);
  }

  private static checkCap(localRay: Ray, t: number) {
    const x = localRay.origin.x + t * localRay.direction.x;
    const z = localRay.origin.z + t * localRay.direction.z;
    const y = localRay.origin.y + t * localRay.direction.y;

    return x ** 2 + z ** 2 - Math.abs(y) <= EPSILON;
  }

  private intersectCaps(localRay: Ray): Intersection<Cone>[] {
    if (!this._closed || Math.abs(localRay.direction.y) <= EPSILON) {
      return [];
    }

    return [this._minimum, this._maximum].reduce<Intersection<Cone>[]>(
      (intersections, b) => {
        const t = (b - localRay.origin.y) / localRay.direction.y;

        if (Cone.checkCap(localRay, t)) {
          intersections.push(new Intersection(t, this));
        }

        return intersections;
      },
      [],
    );
  }

  equals(s: Cone) {
    if (this === s) {
      return true;
    }

    return (
      super.equals(s) &&
      this._minimum === s._minimum &&
      this._maximum === s._maximum &&
      this._closed === s._closed
    );
  }
}
