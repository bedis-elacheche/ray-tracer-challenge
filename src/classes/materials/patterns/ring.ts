import { Point } from "../../core";
import { Color } from "../color";
import { Pattern } from "./pattern";

export class Ring extends Pattern {
  localColorAt(p: Point): Color {
    const [a, b] = this.colors;

    return Math.floor(Math.sqrt(p.x ** 2 + p.z ** 2)) % 2 ? b : a;
  }
}
