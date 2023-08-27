import { Material } from "../materials";
import { Intersection, Ray } from "../world";
import { BaseShape, BaseShapeProps, CompositeShape } from "./abstract";
import { Group } from "./group";
import { Shape } from "./shape";

export type CSGOperation = "union" | "intersection" | "difference";

export type CSGOperand = CSG | Group | Shape;

export type CSGParent = CSG | Group | null;

export type CSGProps = BaseShapeProps<CSGParent> & {
  operation: CSGOperation;
  left: CSGOperand;
  right: CSGOperand;
};

export class CSG extends BaseShape<CSGParent> implements CompositeShape {
  public operation: string;
  public left: CSGOperand;
  public right: CSGOperand;

  constructor({ operation, left, right, ...rest }: CSGProps) {
    super(rest);

    this.operation = operation;

    this.left = left;
    this.left.parent = this;

    this.right = right;
    this.right.parent = this;
  }

  static isIntersectionAllowed(
    operation: CSGOperation,
    isLeftShapeHit: boolean,
    hitInsideLeftShape: boolean,
    hitInsideRightShape: boolean,
  ): boolean {
    if (operation === "union") {
      return (
        (isLeftShapeHit && !hitInsideRightShape) ||
        (!isLeftShapeHit && !hitInsideLeftShape)
      );
    }

    if (operation === "intersection") {
      return (
        (isLeftShapeHit && hitInsideRightShape) ||
        (!isLeftShapeHit && hitInsideLeftShape)
      );
    }

    return (
      (isLeftShapeHit && !hitInsideRightShape) ||
      (!isLeftShapeHit && hitInsideLeftShape)
    );
  }

  intersect(r: Ray): Intersection<CSGOperand>[] {
    return [];
  }

  localIntersect(localRay: Ray): Intersection<CSGOperand>[] {
    return [];
  }

  applyMaterial(material: Material) {
    [this.left, this.right].forEach((operand) => {
      if (operand instanceof Group || operand instanceof CSG) {
        operand.applyMaterial(material);
      } else {
        operand.material = material;
      }
    });
  }

  protected areParentsEqual(sParent: CSGParent) {
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

  equals(csg: CSG): boolean {
    if (this === csg) {
      return true;
    }

    return (
      this.operation === csg.operation &&
      this.areParentsEqual(csg.parent) &&
      this.left === csg.left &&
      this.right === csg.right
    );
  }
}
