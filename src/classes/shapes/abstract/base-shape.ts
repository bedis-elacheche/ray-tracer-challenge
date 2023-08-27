import { Matrix, Point, Vector } from "../../core";
import { Material } from "../../materials";
import { Intersection, Ray } from "../../world";

export type BaseShapeProps<TParent> = {
  origin?: Point;
  transform?: Matrix;
  material?: Material;
  parent?: TParent;
};

export abstract class BaseShape<TParent = unknown> {
  public transform: Matrix;
  public origin: Point;
  public material: Material;
  public parent: TParent | null;

  constructor({
    origin = new Point(0, 0, 0),
    transform = Matrix.identity(4),
    material = new Material(),
    parent = null,
  }: BaseShapeProps<TParent> = {}) {
    this.origin = origin;
    this.transform = transform;
    this.material = material;
    this.parent = parent;
  }

  normalAt(_point: Point, _intersection?: Intersection): Vector {
    throw new Error("normalAt can only be called on concrete shapes");
  }

  localNormalAt(_localPoint: Point, _intersection?: Intersection): Vector {
    throw new Error("localNormalAt can only be called on concrete shapes");
  }

  abstract intersect(r: Ray): Intersection<BaseShape<TParent>>[];

  abstract localIntersect(localRay: Ray): Intersection<BaseShape<TParent>>[];

  protected abstract areParentsEqual(sParent: TParent): boolean;

  abstract equals(sParent: BaseShape<TParent>): boolean;
}
