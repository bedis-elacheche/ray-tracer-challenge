import { Color } from "../color";
import { Matrix } from "../matrix";
import { Point } from "../point";
import { Pattern } from "./pattern";

export class Gradient extends Pattern {
  public a: Color;
  public b: Color;

  constructor(a: Color, b: Color, transform?: Matrix) {
    super(transform);
    this.a = a;
    this.b = b;
  }

  localColorAt(p: Point): Color {
    const distance = this.b.subtract(this.a);
    const fraction = p.x - Math.floor(p.x);

    return this.a.add(distance.multiply(fraction));
  }
}
