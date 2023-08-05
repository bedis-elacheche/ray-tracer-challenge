import { Intersection } from "./intersection";
import { Matrix } from "./matrix";
import { Point } from "./point";
import { Shape } from "./shape";
import { Sphere } from "./sphere";
import { Vector } from "./vector";

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
      matrix.multiply(this.direction)
    );
  }
}
