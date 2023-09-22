import { Matrix, Point, Transformations } from "../../../core";
import { BaseShape } from "../../../shapes";
import { Color } from "../../color";
import { Pattern } from "../pattern";
import { SolidPattern } from "../solid-pattern";

export class XYZPattern implements Pattern {
  public static __name__ = "pattern";
  public transform: Matrix;
  public patterns: Pattern[];

  constructor({
    transform = Matrix.identity(4),
    patterns = [SolidPattern.Black(), SolidPattern.White()],
  }: {
    patterns?: Pattern[];
    transform?: Matrix;
  } = {}) {
    this.transform = transform;
    this.patterns = patterns;
  }

  serialize(): JSONObject {
    return {
      __type: XYZPattern.__name__,
      patterns: this.patterns.map((pattern) => pattern.serialize()),
      transform: this.transform.serialize(),
    };
  }

  static deserialize(_json: JSONObject): XYZPattern {
    throw new Error("Cannot deserialize object.");
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

  equals(p: XYZPattern) {
    if (p === this) {
      return true;
    }

    return (
      this.constructor.name === p.constructor.name &&
      this.patterns.every((pattern, i) => pattern.equals(p.patterns[i])) &&
      this.transform.equals(p.transform)
    );
  }
}
