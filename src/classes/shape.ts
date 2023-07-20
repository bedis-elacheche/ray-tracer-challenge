import { Material } from "./material";
import { Matrix } from "./matrix";
import { Point } from "./point";
import { Vector } from "./vector";

export class Shape {
  public transform: Matrix;
  public origin: Point;
  public material: Material;

  constructor(
    origin = new Point(0, 0, 0),
    transform = Matrix.identity(4),
    material = new Material()
  ) {
    this.origin = origin;
    this.transform = transform;
    this.material = material;
  }

  normalAt(worldPoint: Point) {
    const invertedTransformation = this.transform.inverse();
    const objectPoint = invertedTransformation.multiply(worldPoint);
    const objectNormal = objectPoint.subtract(this.origin);
    const worldNormal = invertedTransformation
      .transpose()
      .multiply(objectNormal);

    return new Vector(worldNormal.x, worldNormal.y, worldNormal.z).normalize();
  }

  equals(s: Shape) {
    if (this === s) {
      return true;
    }

    return (
      this.transform.equals(s.transform) &&
      this.origin.equals(s.origin) &&
      this.material.equals(s.material)
    );
  }
}
