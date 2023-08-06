import { Color } from "../color";
import { Matrix } from "../matrix";
import { Point } from "../point";
import { Shape } from "../shape";

export class Pattern {
  public transform: Matrix;

  constructor(transform = Matrix.identity(4)) {
    this.transform = transform;
  }

  colorAt(p: Point, s?: Shape): Color {
    if (s) {
      const objectPoint = s.transform.inverse().multiply(p);
      const patternPoint = this.transform.inverse().multiply(objectPoint);

      return this.localColorAt(patternPoint);
    }

    return this.localColorAt(p);
  }

  localColorAt(p: Point) {
    return new Color(p.x, p.y, p.z);
  }
}
