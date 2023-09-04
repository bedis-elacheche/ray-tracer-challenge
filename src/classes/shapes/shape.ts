import { Point, Serializable, Transformations, Vector } from "../core";
import { Intersection, Ray } from "../engine";
import { Material } from "../materials";
import { BaseShape, BaseShapeProps } from "./abstract/base-shape";
import { CSG } from "./csg";
import { Group } from "./group";

export type ShapeParent = CSG | Group | null;

export type ShapeProps = BaseShapeProps<ShapeParent> & {
  hasShadow?: boolean;
  material?: Material;
};

export class Shape extends BaseShape<ShapeParent> implements Serializable {
  public static __name__ = "shape";
  public material: Material;
  public hasShadow: boolean;

  constructor({
    material = new Material(),
    origin,
    transform,
    parent,
    hasShadow = true,
  }: ShapeProps = {}) {
    super({
      origin,
      transform,
      parent,
    });

    this.material = material;
    this.hasShadow = hasShadow;
  }

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      __type: Shape.__name__,
      material: this.material.serialize(),
      hasShadow: this.hasShadow,
    };
  }

  static deserialize({ __type, hasShadow, material, ...rest }: JSONObject) {
    if (__type === Shape.__name__) {
      const { origin, transform, parent } = BaseShape.deserialize({
        __type: BaseShape.__name__,
        ...rest,
      });

      return new Shape({
        origin,
        transform,
        hasShadow: !!hasShadow,
        parent: parent as ShapeParent,
        material: Material.deserialize(material),
      });
    }

    throw new Error("Cannot deserialize object.");
  }

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
      this.constructor.name === s.constructor.name &&
      this.hasShadow === s.hasShadow &&
      this.areParentsEqual(s.parent) &&
      this.transform.equals(s.transform) &&
      this.origin.equals(s.origin) &&
      this.material.equals(s.material)
    );
  }
}
