import { BaseShape } from "../shapes";
import { Matrix } from "./matrix";
import { Point } from "./point";
import { Vector } from "./vector";

export class Transformations {
  static translation(x: number, y: number, z: number) {
    const matrix = Matrix.identity(4);

    matrix.set(0, 3, x);
    matrix.set(1, 3, y);
    matrix.set(2, 3, z);

    return matrix;
  }

  static scale(x: number, y: number, z: number) {
    const matrix = new Matrix(4, 4);

    matrix.set(0, 0, x);
    matrix.set(1, 1, y);
    matrix.set(2, 2, z);
    matrix.set(3, 3, 1);

    return matrix;
  }

  static rotateX(radians: number) {
    const matrix = new Matrix(4, 4);

    matrix.set(0, 0, 1);
    matrix.set(1, 1, Math.cos(radians));
    matrix.set(1, 2, -Math.sin(radians));
    matrix.set(2, 1, Math.sin(radians));
    matrix.set(2, 2, Math.cos(radians));
    matrix.set(3, 3, 1);

    return matrix;
  }

  static rotateY(radians: number) {
    const matrix = new Matrix(4, 4);

    matrix.set(0, 0, Math.cos(radians));
    matrix.set(0, 2, Math.sin(radians));
    matrix.set(1, 1, 1);
    matrix.set(2, 0, -Math.sin(radians));
    matrix.set(2, 2, Math.cos(radians));
    matrix.set(3, 3, 1);

    return matrix;
  }

  static rotateZ(radians: number) {
    const matrix = new Matrix(4, 4);

    matrix.set(0, 0, Math.cos(radians));
    matrix.set(0, 1, -Math.sin(radians));
    matrix.set(1, 0, Math.sin(radians));
    matrix.set(1, 1, Math.cos(radians));
    matrix.set(2, 2, 1);
    matrix.set(3, 3, 1);

    return matrix;
  }

  static skew(
    xy: number,
    xz: number,
    yx: number,
    yz: number,
    zx: number,
    zy: number,
  ) {
    const matrix = Matrix.identity(4);

    matrix.set(0, 1, xy);
    matrix.set(0, 2, xz);
    matrix.set(1, 0, yx);
    matrix.set(1, 2, yz);
    matrix.set(2, 0, zx);
    matrix.set(2, 1, zy);

    return matrix;
  }

  static viewTransform(from: Point, to: Point, up: Vector) {
    const matrix = Matrix.identity(4);

    const forward = to.subtract(from).normalize();
    const left = forward.cross(up.normalize());
    const trueUp = left.cross(forward);

    matrix.set(0, 0, left.x);
    matrix.set(0, 1, left.y);
    matrix.set(0, 2, left.z);

    matrix.set(1, 0, trueUp.x);
    matrix.set(1, 1, trueUp.y);
    matrix.set(1, 2, trueUp.z);

    matrix.set(2, 0, -forward.x);
    matrix.set(2, 1, -forward.y);
    matrix.set(2, 2, -forward.z);

    return matrix.multiply(
      Transformations.translation(-from.x, -from.y, -from.z),
    );
  }

  static worldToObject(item: BaseShape, point: Point) {
    if (item.parent instanceof BaseShape) {
      point = Transformations.worldToObject(item.parent, point);
    }

    return item.transform.inverse().multiply(point);
  }

  static normalToWorld(item: BaseShape, vector: Vector) {
    let normal = Vector.from(
      item.transform.inverse().transpose().multiply(vector),
    ).normalize();

    if (item.parent instanceof BaseShape) {
      normal = Transformations.normalToWorld(item.parent, normal);
    }

    return normal;
  }
}
