import { Matrix } from "../core";
import { Material } from "../materials";
import { Intersection, Ray } from "../world";
import { Shape } from "./shape";

export type GroupChild = Group | Shape;

export class Group {
  public children: GroupChild[];
  public transform: Matrix;
  public parent: Group | null;
  public material: Material;

  constructor({
    children = [],
    transform = Matrix.identity(4),
    material = new Material(),
    parent = null,
  }: {
    children?: GroupChild[];
    material?: Material;
    transform?: Matrix;
    parent?: Group;
  } = {}) {
    this.children = children;
    this.transform = transform;
    this.parent = parent;
    this.material = material;

    this.children.forEach((child) => {
      child.parent = this;
    });

    this.applyMaterial(material);
  }

  applyMaterial(material: Material) {
    this.children.forEach((child) => {
      if (child instanceof Group) {
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

  intersect(r: Ray) {
    const localRay = r.transform(this.transform.inverse());

    return this.localIntersect(localRay);
  }

  localIntersect(localRay: Ray): Intersection[] {
    return this.children
      .flatMap((item) => item.intersect(localRay))
      .sort((a, z) => a.t - z.t);
  }

  equals(group: Group): boolean {
    if (this === group) {
      return true;
    }

    return (
      this.transform.equals(group.transform) &&
      this.children.every((item, index) => {
        const otherChild = group.children[index];

        if (item instanceof Group && otherChild instanceof Group) {
          return item.equals(otherChild);
        }

        if (item instanceof Shape && otherChild instanceof Shape) {
          return item.equals(otherChild);
        }

        return false;
      })
    );
  }
}
