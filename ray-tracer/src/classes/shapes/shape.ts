import { Point, Serializable, Transformations, Vector } from "../core";
import { Intersection, Ray } from "../engine";
import { Material } from "../materials";
import { BaseShape, BaseShapeProps } from "./abstract/base-shape";
import { BoundingBox } from "./bounding-box";
import { CSG } from "./csg";
import { Group } from "./group";

export type ShapeParent = CSG | Group | null;

export type ShapeProps = BaseShapeProps<ShapeParent> & {
  hasShadow?: boolean;
  material?: Material;
};

export class Shape extends BaseShape<ShapeParent> implements Serializable {
  public static __name__ = "shape";
  protected _material: Material;
  protected _hasShadow: boolean;

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

    this._material = material;
    this._hasShadow = hasShadow;
  }

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      __type: Shape.__name__,
      material: this._material.serialize(),
      hasShadow: this._hasShadow,
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

  get material(): Material {
    return this._material;
  }

  set material(value: Material) {
    this._material = value;
  }

  get hasShadow(): boolean {
    return this._hasShadow;
  }

  set hasShadow(value: boolean) {
    this._hasShadow = value;
  }

  get bounds() {
    if (!this._bounds) {
      this._bounds = new BoundingBox({
        min: new Point(-1, -1, -1),
        max: new Point(1, 1, 1),
      });
    }

    return this._bounds;
  }

  divide(_threshold: number) {}

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
      this._hasShadow === s._hasShadow &&
      this.areParentsEqual(s.parent) &&
      this.transform.equals(s.transform) &&
      this.origin.equals(s.origin) &&
      this._material.equals(s._material)
    );
  }
}
