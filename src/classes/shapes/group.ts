import { Material } from "../materials";
import { Intersection, Ray } from "../world";
import { BaseShape, BaseShapeProps, CompositeShape } from "./abstract";
import { CSG } from "./csg";
import { Shape } from "./shape";

export type GroupChild = Group | CSG | Shape;

export type GroupParent = CSG | Group | null;

export type GroupProps = BaseShapeProps<GroupParent> & {
  name?: string;
  children?: GroupChild[];
};

export class Group extends BaseShape<GroupParent> implements CompositeShape {
  public name: string;
  public children: GroupChild[];

  constructor({
    name = `Group ${Date.now()}`,
    children = [],
    ...rest
  }: GroupProps = {}) {
    super(rest);
    this.name = name;
    this.children = children;

    this.children.forEach((child) => {
      child.parent = this;
    });

    this.applyMaterial(rest.material);
  }

  applyMaterial(material: Material) {
    this.children.forEach((child) => {
      if (child instanceof Group || child instanceof CSG) {
        child.applyMaterial(material);
      } else {
        child.material = material;
      }
    });
  }

  addChildren(shapes: GroupChild[]) {
    shapes.forEach((shape) => {
      shape.parent = this;
    });

    this.children.push(...shapes);
  }

  intersect(r: Ray): Intersection<GroupChild>[] {
    const localRay = r.transform(this.transform.inverse());

    return this.localIntersect(localRay);
  }

  localIntersect(localRay: Ray): Intersection<GroupChild>[] {
    return this.children
      .flatMap((item) => item.intersect(localRay))
      .sort((a, z) => a.t - z.t);
  }

  protected areParentsEqual(sParent: GroupParent) {
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

  equals(group: Group): boolean {
    if (this === group) {
      return true;
    }

    return (
      this.name === group.name &&
      this.areParentsEqual(group.parent) &&
      this.transform.equals(group.transform) &&
      this.children.every((item, index) => {
        const otherChild = group.children[index];

        if (item instanceof Group && otherChild instanceof Group) {
          return item.equals(otherChild);
        }

        if (item instanceof Shape && otherChild instanceof Shape) {
          return item.equals(otherChild);
        }

        if (item instanceof CSG && otherChild instanceof CSG) {
          return item.equals(otherChild);
        }

        return false;
      })
    );
  }
}
