import { Point, Transformations, Vector } from "../core";
import { Intersection, Ray } from "../world";
import { BaseShape, BaseShapeProps } from "./abstract/base-shape";
import { CSG } from "./csg";
import { Group } from "./group";

export type ShapeParent = CSG | Group | null;

export type ShapeProps = BaseShapeProps<ShapeParent>;

export class Shape extends BaseShape<ShapeParent> {
  normalAt(point: Point, intersection?: Intersection): Vector {
    const localPoint = Transformations.worldToObject(this, point);
    const localNormal = this.localNormalAt(localPoint, intersection);

    return Transformations.normalToWorld(this, localNormal);
  }

  localNormalAt(localPoint: Point, _intersection?: Intersection): Vector {
    return new Vector(localPoint.x, localPoint.y, localPoint.z);
  }

  intersect(r: Ray): Intersection<Shape>[] {
    const localRay = r.transform(this.transform.inverse());

    return this.localIntersect(localRay);
  }

  localIntersect(_localRay: Ray): Intersection<Shape>[] {
    return [];
  }

  protected areParentsEqual(sParent: ShapeParent) {
    if (this.parent === null && sParent === null) {
      return true;
    }

    if (this.parent instanceof Group && sParent instanceof Group) {
      return this.parent.equals(sParent);
    }

    if (this.parent instanceof CSG && sParent instanceof CSG) {
      return this.parent.equals(sParent);
    }

    return false;
  }

  equals(s: Shape) {
    if (this === s) {
      return true;
    }

    return (
      this.areParentsEqual(s.parent) &&
      this.transform.equals(s.transform) &&
      this.origin.equals(s.origin) &&
      this.material.equals(s.material)
    );
  }
}
