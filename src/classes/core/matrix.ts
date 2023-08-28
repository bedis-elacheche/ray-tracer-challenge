import { EPSILON } from "./constants";
import { Point } from "./point";
import { Tuple } from "./tuple";
import { clamp } from "./utils";
import { Vector } from "./vector";

export class Matrix {
  public rows: number;
  public cols: number;
  private items: number[][];
  private _inverse: Matrix;

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.items = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => 0),
    );
  }

  static from(items: number[][]) {
    const allColsHaveSameLength = items.every(
      (row) => row.length === items[0].length,
    );

    if (!allColsHaveSameLength) {
      return null;
    }

    const matrix = new Matrix(items.length, items[0].length);

    for (let y = 0; y < matrix.rows; y++) {
      for (let x = 0; x < matrix.cols; x++) {
        matrix.set(y, x, items.at(y).at(x));
      }
    }

    return matrix;
  }

  static identity(size: number) {
    const matrix = new Matrix(size, size);

    for (let d = 0; d < size; d++) {
      matrix.set(d, d, 1);
    }

    return matrix;
  }

  get(y: number, x: number) {
    if (clamp(0, this.cols - 1, x) !== x || clamp(0, this.rows - 1, y) !== y) {
      return null;
    }

    return this.items.at(y).at(x);
  }

  set(y: number, x: number, value: number) {
    if (clamp(0, this.cols - 1, x) === x && clamp(0, this.rows - 1, y) === y) {
      this.items[y][x] = value;
    }

    this._inverse = null;

    return this;
  }

  equals(matrix: Matrix) {
    if (matrix === this) {
      return true;
    }

    return this.items.every((row, y) =>
      row.every((item, x) => Math.abs(item - matrix.get(y, x)) < EPSILON),
    );
  }

  multiply<T extends Tuple>(item: T): T;
  multiply(item: Matrix): Matrix;
  multiply(item: Matrix | Tuple | Point | Vector) {
    if (!(item instanceof Matrix)) {
      const dotProducts = this.items.map(([x, y, z, w]) =>
        new Tuple(x, y, z, w).dot(item),
      );

      const tuple = new Tuple(
        dotProducts[0],
        dotProducts[1],
        dotProducts[2],
        dotProducts[3],
      );

      if (Point.isPoint(tuple)) {
        return Point.from(tuple);
      }

      if (Vector.isVector(tuple)) {
        return Vector.from(tuple);
      }

      return tuple;
    }

    const matrix = new Matrix(4, 4);

    for (let y = 0; y < matrix.rows; y++) {
      for (let x = 0; x < matrix.cols; x++) {
        const row = new Tuple(
          this.get(y, 0) || 0,
          this.get(y, 1) || 0,
          this.get(y, 2) || 0,
          this.get(y, 3) || 0,
        );
        const col = new Tuple(
          item.get(0, x) || 0,
          item.get(1, x) || 0,
          item.get(2, x) || 0,
          item.get(3, x) || 0,
        );

        matrix.set(y, x, col.dot(row));
      }
    }

    return matrix;
  }

  transpose() {
    const matrix = new Matrix(this.rows, this.cols);

    for (let y = 0; y < matrix.rows; y++) {
      for (let x = 0; x < matrix.cols; x++) {
        matrix.set(y, x, this.get(x, y));
      }
    }

    return matrix;
  }

  determinant() {
    if (this.cols === 2 && this.rows === 2) {
      return this.get(0, 0) * this.get(1, 1) - this.get(1, 0) * this.get(0, 1);
    }

    let determinant = 0;

    for (let x = 0; x < this.cols; x++) {
      determinant += this.cofactor(0, x) * this.get(0, x);
    }

    return determinant;
  }

  submatrix(row: number, col: number) {
    if (
      clamp(0, this.cols - 1, col) !== col ||
      clamp(0, this.rows - 1, row) !== row
    ) {
      return null;
    }

    return Matrix.from(
      this.items.reduce<number[][]>((acc, item, y) => {
        if (y === row) {
          return acc;
        }

        return [...acc, item.filter((_, x) => x !== col)];
      }, []),
    );
  }

  minor(row: number, col: number) {
    return this.submatrix(row, col).determinant();
  }

  cofactor(row: number, col: number) {
    const minor = this.minor(row, col);

    return (row + col) % 2 ? -minor : minor;
  }

  isInvertible() {
    return this.determinant() !== 0;
  }

  inverse() {
    if (this._inverse) {
      return this._inverse;
    }

    const determinant = this.determinant();

    if (determinant === 0) {
      return null;
    }

    const matrix = new Matrix(this.cols, this.rows);

    for (let y = 0; y < matrix.rows; y++) {
      for (let x = 0; x < matrix.cols; x++) {
        const cofactor = this.cofactor(x, y);

        matrix.set(y, x, cofactor / determinant);
      }
    }

    this._inverse = matrix;

    return matrix;
  }
}
