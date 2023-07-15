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

  intersect<T extends Shape>(shape: T): Intersection[] {
    const transformed = this.transform(shape.transform.inverse());

    const worldOrigin = new Point(0, 0, 0);
    if (shape instanceof Sphere) {
      const sphereToRay = transformed.origin.subtract(worldOrigin);

      const a = transformed.direction.dot(transformed.direction);
      const b = 2 * transformed.direction.dot(sphereToRay);
      const c = sphereToRay.dot(sphereToRay) - 1;
      const discriminant = b ** 2 - 4 * a * c;

      if (discriminant < 0) {
        return [];
      }

      return [
        new Intersection((-b - Math.sqrt(discriminant)) / (2 * a), shape),
        new Intersection((-b + Math.sqrt(discriminant)) / (2 * a), shape),
      ];
    }

    return [];
  }

  transform(matrix: Matrix) {
    return new Ray(
      matrix.multiply(this.origin),
      matrix.multiply(this.direction)
    );
  }
}
