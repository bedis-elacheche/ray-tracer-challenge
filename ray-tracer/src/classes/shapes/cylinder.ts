import { EPSILON, Point, Vector } from "../core";
import { Intersection, Ray } from "../engine";
import { BoundingBox } from "./bounding-box";
import { Shape, ShapeProps } from "./shape";

export class Cylinder extends Shape {
  public static readonly __name__ = "cylinder";
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
    super({ hasShadow, origin, transform, material, parent });

    this._minimum = minimum;
    this._maximum = maximum;
    this._closed = closed;
  }

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      __type: Cylinder.__name__,
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

  get minimum() {
    return this._minimum;
  }

  set minimum(value: number) {
    this._minimum = value;
    this.resetBounds();
  }

  get maximum() {
    return this._maximum;
  }

  set maximum(value: number) {
    this._maximum = value;
    this.resetBounds();
  }

  get closed() {
    return this._closed;
  }

  set closed(value: boolean) {
    this._closed = value;
  }

  get bounds() {
    if (!this._bounds) {
      this._bounds = new BoundingBox({
        min: new Point(-1, this._minimum, -1),
        max: new Point(1, this._maximum, 1),
      });
    }

    return this._bounds;
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

      if (this._minimum < y && y < this._maximum) {
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
    if (!this._closed || Math.abs(localRay.direction.y) <= EPSILON) {
      return [];
    }

    return [this._minimum, this._maximum].reduce<Intersection<Cylinder>[]>(
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
      this._minimum === s._minimum &&
      this._maximum === s._maximum &&
      this._closed === s._closed
    );
  }
}
