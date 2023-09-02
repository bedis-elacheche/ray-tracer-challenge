import { Point } from "../../core";
import { Color } from "../color";
import { Pattern } from "./pattern";

export class Stripes extends Pattern {
  localColorAt(p: Point): Color {
    const [a, b] = this.colors;

    return Math.floor(p.x) % 2 ? b : a;
  }
}
