import { Point } from "../../core";
import { Color } from "../color";
import { Pattern } from "./pattern";

export class Gradient extends Pattern {
  localColorAt(p: Point): Color {
    const [a, b] = this.colors;
    const distance = b.subtract(a);
    const fraction = p.x - Math.floor(p.x);

    return a.add(distance.multiply(fraction));
  }
}
