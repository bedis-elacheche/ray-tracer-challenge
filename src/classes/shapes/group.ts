import { Intersection, Ray } from "../engine";
import { Material } from "../materials";
import { BaseShape, BaseShapeProps, CompositeShape } from "./abstract";
import { CSG } from "./csg";
import { Shape } from "./shape";
import { ShapeDeserializer } from "./shape-deserializer";

export type GroupChild = Group | CSG | Shape;

export type GroupParent = CSG | Group | null;

export type GroupProps = BaseShapeProps<GroupParent> & {
  name?: string;
  children?: GroupChild[];
};

export class Group extends BaseShape<GroupParent> implements CompositeShape {
  public static readonly __name__ = "group";
  private _name: string;
  private _children: GroupChild[];

  constructor({
    name = `Group ${Date.now()}`,
    children = [],
    origin,
    transform,
    parent,
  }: GroupProps = {}) {
    super({
      origin,
      transform,
      parent,
    });
    this._name = name;
    this._children = children;

    this._children.forEach((child) => {
      child.parent = this;
    });
  }

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      __type: Group.__name__,
      name: this._name,
      children: this._children.map((child) => child.serialize()),
    };
  }

  static deserialize({ __type, name, children, ...rest }: JSONObject) {
    if (__type === Group.__name__) {
      const { origin, transform, parent } = BaseShape.deserialize({
        __type: BaseShape.__name__,
        ...rest,
      });

      return new Group({
        origin,
        transform,
        parent: parent as GroupParent,
        name,
        children: children.map(ShapeDeserializer.deserialize),
      });
    }

    throw new Error("Cannot deserialize object.");
  }

  applyMaterial(material: Material) {
    this._children.forEach((child) => {
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

    this._children.push(...shapes);
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

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get children(): GroupChild[] {
    return this._children;
  }

  protected areParentsEqual(sParent: GroupParent) {
    if (this._parent === null && sParent === null) {
      return true;
    }

    if (this._parent instanceof Group && sParent instanceof Group) {
      return this._parent.equals(sParent);
    }

    if (this._parent instanceof CSG && sParent instanceof CSG) {
      return this._parent.equals(sParent);
    }

    return false;
  }

  includes(s: BaseShape): boolean {
    return this._children.some((operand) => {
      if (operand instanceof CSG && operand instanceof CSG) {
        return operand.includes(s);
      }

      if (operand instanceof Group && s instanceof Group) {
        return operand.includes(s);
      }

      if (operand instanceof Shape && s instanceof Shape) {
        return operand.equals(s);
      }

      return false;
    });
  }

  equals(group: Group): boolean {
    if (this === group) {
      return true;
    }

    return (
      this._name === group._name &&
      this.areParentsEqual(group._parent) &&
      this.transform.equals(group._transform) &&
      this._children.every((item, index) => {
        const otherChild = group._children[index];

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
