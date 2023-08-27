import { Matrix, Point, Transformations, Vector } from "../core";
import { Material } from "../materials";
import { Intersection, Ray } from "../world";
import { Group } from "./group";

export type ShapeProps = {
  origin?: Point;
  transform?: Matrix;
  material?: Material;
  parent?: Group;
};

export class Shape {
  public transform: Matrix;
  public origin: Point;
  public material: Material;
  public parent: Group | null;

  constructor({
    origin = new Point(0, 0, 0),
    transform = Matrix.identity(4),
    material = new Material(),
    parent = null,
  }: ShapeProps = {}) {
    this.origin = origin;
    this.transform = transform;
    this.material = material;
    this.parent = parent;
  }

  normalAt(point: Point, intersection?: Intersection) {
    const localPoint = Transformations.worldToObject(this, point);
    const localNormal = this.localNormalAt(localPoint, intersection);

    return Transformations.normalToWorld(this, localNormal);
  }

  localNormalAt(localPoint: Point, _intersection?: Intersection) {
    return new Vector(localPoint.x, localPoint.y, localPoint.z);
  }

  intersect(r: Ray) {
    const localRay = r.transform(this.transform.inverse());

    return this.localIntersect(localRay);
  }

  localIntersect(_localRay: Ray): Intersection[] {
    return [];
  }

  equals(s: Shape) {
    if (this === s) {
      return true;
    }

    const areParentsEqual =
      this.parent === null && s.parent === null
        ? true
        : this.parent !== null &&
          s.parent !== null &&
          this.parent.equals(s.parent);

    return (
      this.transform.equals(s.transform) &&
      this.origin.equals(s.origin) &&
      this.material.equals(s.material) &&
      areParentsEqual
    );
  }
}
