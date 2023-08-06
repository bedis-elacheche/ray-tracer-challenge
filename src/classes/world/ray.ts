import { Matrix, Point, Vector } from "../core";

export class Ray {
  public origin: Point;
  public direction: Vector;

  constructor(origin: Point, direction: Vector) {
    this.origin = origin;
    this.direction = direction;
  }

  position(time: number) {
    return this.origin.add(this.direction.multiply(time));
  }

  transform(matrix: Matrix) {
    return new Ray(
      matrix.multiply(this.origin),
      matrix.multiply(this.direction),
    );
  }
}
