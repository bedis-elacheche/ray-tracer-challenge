import { Color } from "../color";
import { Matrix } from "../matrix";
import { Point } from "../point";
import { Pattern } from "./pattern";

export class Stripe extends Pattern {
  public a: Color;
  public b: Color;

  constructor(a: Color, b: Color, transform?: Matrix) {
    super(transform);
    this.a = a;
    this.b = b;
  }

  localColorAt(p: Point): Color {
    return Math.floor(p.x) % 2 ? this.b : this.a;
  }
}
