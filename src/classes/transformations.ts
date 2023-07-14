import { Matrix } from "./matrix";

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
    zy: number
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
}
