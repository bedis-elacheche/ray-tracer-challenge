import { Color } from "../color";
import { Matrix } from "../matrix";
import { Point } from "../point";
import { Shape } from "../shape";
import { Pattern } from "./pattern";

export class Stripe extends Pattern {
  public a: Color;
  public b: Color;

  constructor(a: Color, b: Color, transform = Matrix.identity(4)) {
    super();
    this.a = a;
    this.b = b;
    this.transform = transform;
  }

  localColorAt(p: Point): Color {
    return Math.floor(p.x) % 2 ? this.b : this.a;
  }
}
