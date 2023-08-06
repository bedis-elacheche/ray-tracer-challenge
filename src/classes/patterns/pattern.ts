import { Color } from "../color";
import { Matrix } from "../matrix";
import { Point } from "../point";
import { Shape } from "../shape";

export abstract class Pattern {
  public transform: Matrix;

  colorAt(p: Point, s?: Shape): Color {
    if (s) {
      const objectPoint = s.transform.inverse().multiply(p);
      const patternPoint = this.transform.inverse().multiply(objectPoint);

      return this.localColorAt(patternPoint);
    }

    return this.localColorAt(p);
  }

  abstract localColorAt(p: Point): Color;
}
