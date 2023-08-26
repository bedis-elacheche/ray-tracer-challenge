import { Matrix, Point, Transformations } from "../../core";
import { Shape } from "../../shapes";
import { Color } from "../color";

export class Pattern {
  public transform: Matrix;

  constructor(transform = Matrix.identity(4)) {
    this.transform = transform;
  }

  colorAt(p: Point, s?: Shape): Color {
    if (s) {
      const objectPoint = Transformations.worldToObject(s, p);
      const patternPoint = this.transform.inverse().multiply(objectPoint);

      return this.localColorAt(patternPoint);
    }

    return this.localColorAt(p);
  }

  localColorAt(p: Point) {
    return new Color(p.x, p.y, p.z);
  }
}
