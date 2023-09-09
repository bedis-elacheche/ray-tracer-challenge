import { Matrix, Point, Serializable, Vector } from "../../core";
import { Intersection, Ray } from "../../engine";

export type BaseShapeProps<TParent> = {
  origin?: Point;
  transform?: Matrix;
  parent?: TParent;
};

export class BaseShape<TParent extends Serializable = Serializable>
  implements Serializable
{
  public static __name__ = "base-shape";
  protected _transform: Matrix;
  protected _origin: Point;
  protected _parent: TParent | null;

  constructor({
    origin = new Point(0, 0, 0),
    transform = Matrix.identity(4),
    parent = null,
  }: BaseShapeProps<TParent> = {}) {
    this._origin = origin;
    this._transform = transform;
    this._parent = parent;
  }

  serialize(): JSONObject {
    return {
      __type: BaseShape.__name__,
      transform: this._transform.serialize(),
      origin: this._origin.serialize(),
    };
  }

  static deserialize({ __type, origin, transform }: JSONObject) {
    if (__type === BaseShape.__name__) {
      return new BaseShape({
        origin: Point.deserialize(origin),
        transform: Matrix.deserialize(transform),
      });
    }
    throw new Error("Cannot deserialize object.");
  }

  get origin() {
    return this._origin;
  }

  set origin(value: Point) {
    this._origin = value;
  }

  get transform() {
    return this._transform;
  }

  set transform(value: Matrix) {
    this._transform = value;
  }

  get parent() {
    return this._parent;
  }

  set parent(value: TParent) {
    this._parent = value;
  }

  normalAt(_point: Point, _intersection?: Intersection): Vector {
    throw new Error("normalAt can only be called on concrete shapes");
  }

  localNormalAt(_localPoint: Point, _intersection?: Intersection): Vector {
    throw new Error("localNormalAt can only be called on concrete shapes");
  }

  intersect(_r: Ray): Intersection<BaseShape<TParent>>[] {
    return [];
  }

  localIntersect(_localRay: Ray): Intersection<BaseShape<TParent>>[] {
    return [];
  }

  protected areParentsEqual(_sParent: TParent): boolean {
    return false;
  }

  equals(_sParent: BaseShape<TParent>): boolean {
    return false;
  }
}
