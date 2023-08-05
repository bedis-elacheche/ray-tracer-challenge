import { Intersection } from "./intersection";
import { Material } from "./material";
import { Matrix } from "./matrix";
import { Point } from "./point";
import { Ray } from "./ray";
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

  normalAt(point: Point) {
    const invertedTransformation = this.transform.inverse();
    const localPoint = invertedTransformation.multiply(point);
    const localNormal = this.localNormalAt(localPoint);
    const worldNormal = invertedTransformation
      .transpose()
      .multiply(localNormal);

    return new Vector(worldNormal.x, worldNormal.y, worldNormal.z).normalize();
  }

  localNormalAt(localPoint: Point) {
    return new Vector(localPoint.x, localPoint.y, localPoint.z);
  }

  intersect(r: Ray) {
    const localRay = r.transform(this.transform.inverse());

    return this.localIntersect(localRay);
  }

  localIntersect(localRay: Ray): Intersection[] {
    return [];
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
