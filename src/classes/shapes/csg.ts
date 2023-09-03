import { Intersection, Ray } from "../engine";
import { Material } from "../materials";
import { BaseShape, BaseShapeProps, CompositeShape } from "./abstract";
import { Group } from "./group";
import { Shape } from "./shape";
import { ShapeDeserializer } from "./shape-deserializer";

export type CSGOperation = "union" | "intersection" | "difference";

export type CSGOperand = CSG | Group | Shape;

export type CSGParent = CSG | Group | null;

export type CSGProps = BaseShapeProps<CSGParent> & {
  operation: CSGOperation;
  left: CSGOperand;
  right: CSGOperand;
};

export class CSG extends BaseShape<CSGParent> implements CompositeShape {
  public static readonly __name__ = "csg";
  public operation: CSGOperation;
  public left: CSGOperand;
  public right: CSGOperand;

  constructor({ operation, left, right, origin, transform, parent }: CSGProps) {
    super({
      origin,
      transform,
      parent,
    });

    this.operation = operation;

    this.left = left;
    this.left.parent = this;

    this.right = right;
    this.right.parent = this;
  }

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      __type: CSG.__name__,
      operation: this.operation,
      left: this.left.serialize(),
      right: this.right.serialize(),
    };
  }

  static deserialize({ __type, operation, left, right, ...rest }: JSONObject) {
    if (__type === CSG.__name__) {
      const { origin, transform, parent } = BaseShape.deserialize({
        __type: BaseShape.__name__,
        ...rest,
      });

      return new CSG({
        origin,
        transform,
        operation,
        parent: parent as CSGParent,
        left: ShapeDeserializer.deserialize(left),
        right: ShapeDeserializer.deserialize(right),
      });
    }

    throw new Error("Cannot deserialize object.");
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
    const localRay = r.transform(this.transform.inverse());

    return this.localIntersect(localRay);
  }

  localIntersect(localRay: Ray): Intersection<CSGOperand>[] {
    const xs = [this.left, this.right]
      .flatMap((item) => item.intersect(localRay))
      .sort((a, z) => a.t - z.t);

    return this.filterIntersections(xs);
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

  includes(s: BaseShape): boolean {
    return [this.left, this.right].some((operand) => {
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

  filterIntersections(
    intersections: Intersection<CSGOperand>[],
  ): Intersection<CSGOperand>[] {
    const { left, operation } = this;
    const result: Intersection<CSGOperand>[] = [];
    let isLeftShapeHit = false;
    let hitInsideLeftShape = false;
    let hitInsideRightShape = false;

    for (const intersection of intersections) {
      const { object } = intersection;

      if (left instanceof Shape && object instanceof Shape) {
        isLeftShapeHit = left.equals(object);
      } else if (
        (left instanceof Group && object instanceof Group) ||
        (left instanceof CSG && object instanceof CSG)
      ) {
        isLeftShapeHit = left.includes(object);
      } else {
        isLeftShapeHit = false;
      }

      if (
        CSG.isIntersectionAllowed(
          operation,
          isLeftShapeHit,
          hitInsideLeftShape,
          hitInsideRightShape,
        )
      ) {
        result.push(intersection);
      }

      if (isLeftShapeHit) {
        hitInsideLeftShape = !hitInsideLeftShape;
      } else {
        hitInsideRightShape = !hitInsideRightShape;
      }
    }

    return result;
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
