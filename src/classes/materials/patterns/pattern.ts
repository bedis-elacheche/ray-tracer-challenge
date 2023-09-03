import { Matrix, Point, Serializable, Transformations } from "../../core";
import { BaseShape } from "../../shapes";
import { Color } from "../color";

export class Pattern implements Serializable {
  public static __name__ = "pattern";
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

  serialize(): JSONObject {
    return {
      __type: Pattern.__name__,
      colors: this.colors.map((color) => color.serialize()),
      transform: this.transform.serialize(),
    };
  }

  static deserialize(_json: JSONObject): Pattern {
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

  equals(p: Pattern) {
    if (p === this) {
      return true;
    }

    return (
      this.constructor.name === p.constructor.name &&
      this.colors.every((color, i) => color.equals(p.colors[i])) &&
      this.transform.equals(p.transform)
    );
  }
}
