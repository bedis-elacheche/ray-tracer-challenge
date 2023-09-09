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
  private _operation: CSGOperation;
  private _left: CSGOperand;
  private _right: CSGOperand;

  constructor({ operation, left, right, origin, transform, parent }: CSGProps) {
    super({
      origin,
      transform,
      parent,
    });

    this._operation = operation;

    this._left = left;
    this._left.parent = this;

    this._right = right;
    this._right.parent = this;
  }

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      __type: CSG.__name__,
      operation: this._operation,
      left: this._left.serialize(),
      right: this._right.serialize(),
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
    [this._left, this._right].forEach((operand) => {
      if (operand instanceof Group || operand instanceof CSG) {
        operand.applyMaterial(material);
      } else {
        operand.material = material;
      }
    });
  }

  includes(s: BaseShape): boolean {
    return [this._left, this._right].some((operand) => {
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
    const result: Intersection<CSGOperand>[] = [];
    let isLeftShapeHit = false;
    let hitInsideLeftShape = false;
    let hitInsideRightShape = false;

    for (const intersection of intersections) {
      const { object } = intersection;

      if (this._left instanceof Shape && object instanceof Shape) {
        isLeftShapeHit = this._left.equals(object);
      } else if (
        (this._left instanceof Group && object instanceof Group) ||
        (this._left instanceof CSG && object instanceof CSG)
      ) {
        isLeftShapeHit = this._left.includes(object);
      } else {
        isLeftShapeHit = false;
      }

      if (
        CSG.isIntersectionAllowed(
          this._operation,
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

  private areChildrenEqual(child: CSGOperand, sChild: CSGOperand) {
    if (child === null && sChild === null) {
      return true;
    }

    if (child instanceof Group && sChild instanceof Group) {
      return child.equals(sChild);
    }

    if (child instanceof CSG && sChild instanceof CSG) {
      return child.equals(sChild);
    }

    return false;
  }

  get operation(): CSGOperation {
    return this._operation;
  }

  set operation(value: CSGOperation) {
    this._operation = value;
  }

  get left(): CSGOperand {
    return this._left;
  }

  set left(value: CSGOperand) {
    this._left = value;
  }

  get right(): CSGOperand {
    return this._right;
  }

  set right(value: CSGOperand) {
    this._right = value;
  }

  equals(csg: CSG): boolean {
    if (this === csg) {
      return true;
    }

    return (
      this._operation === csg._operation &&
      this.areParentsEqual(csg._parent) &&
      this.areChildrenEqual(this._left, csg._left) &&
      this.areChildrenEqual(this._right, csg._right)
    );
  }
}
