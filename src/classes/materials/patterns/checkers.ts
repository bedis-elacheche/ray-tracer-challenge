import { Point } from "../../core";
import { Color } from "../color";
import { Pattern } from "./pattern";

export class Checkers extends Pattern {
  localColorAt(p: Point): Color {
    const [a, b] = this.colors;

    return (Math.floor(p.x) + Math.floor(p.y) + Math.floor(p.z)) % 2 ? b : a;
  }
}
