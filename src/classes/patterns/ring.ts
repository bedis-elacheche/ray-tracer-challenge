import { Color } from "../color";
import { Matrix } from "../matrix";
import { Point } from "../point";
import { Pattern } from "./pattern";

export class Ring extends Pattern {
  public a: Color;
  public b: Color;

  constructor(a: Color, b: Color, transform?: Matrix) {
    super(transform);
    this.a = a;
    this.b = b;
  }

  localColorAt(p: Point): Color {
    return Math.floor(Math.sqrt(p.x ** 2 + p.z ** 2)) % 2 ? this.b : this.a;
  }
}
