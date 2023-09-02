import { Matrix, Point, Transformations } from "../../core";
import { BaseShape } from "../../shapes";
import { Color } from "../color";

export class Pattern {
  public transform: Matrix;
  public colors: Color[];

  constructor({
    transform = Matrix.identity(4),
    colors = [new Color(0, 0, 0), new Color(1, 1, 1)],
  }: {
    colors?: Color[];
    transform?: Matrix;
  } = {}) {
    this.transform = transform;
    this.colors = colors;
  }

  colorAt(p: Point, s?: BaseShape): Color {
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
