import { Matrix, Point, Serializable, Vector } from "../../core";
import { Intersection, Ray } from "../../engine";
import { ShapeDeserializer } from "../shape-deserializer";

export type BaseShapeProps<TParent> = {
  origin?: Point;
  transform?: Matrix;
  parent?: TParent;
};

export class BaseShape<TParent extends Serializable = Serializable>
  implements Serializable
{
  public static __name__ = "base-shape";
  public transform: Matrix;
  public origin: Point;
  public parent: TParent | null;

  constructor({
    origin = new Point(0, 0, 0),
    transform = Matrix.identity(4),
    parent = null,
  }: BaseShapeProps<TParent> = {}) {
    this.origin = origin;
    this.transform = transform;
    this.parent = parent;
  }

  serialize(): JSONObject {
    return {
      __type: BaseShape.__name__,
      transform: this.transform.serialize(),
      origin: this.origin.serialize(),
      parent: this.parent && this.parent.serialize(),
    };
  }

  static deserialize({ __type, origin, transform, parent }: JSONObject) {
    if (__type === BaseShape.__name__) {
      return new BaseShape({
        origin: Point.deserialize(origin),
        transform: Matrix.deserialize(transform),
        parent: parent && ShapeDeserializer.deserialize(parent),
      });
    }
    throw new Error("Cannot deserialize object.");
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
