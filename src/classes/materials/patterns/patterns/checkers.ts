import { EPSILON, Matrix, mod, Point } from "../../../core";
import { Color } from "../../color";
import { Pattern } from "./pattern";

export class Checkers extends Pattern {
  public static readonly __name__ = "checkers-pattern";

  localColorAt(p: Point): Color {
    const [a, b] = this.colors;

    return mod(Math.floor(p.x) + Math.floor(p.y) + Math.floor(p.z), 2) <=
      EPSILON
      ? a
      : b;
  }

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      __type: Checkers.__name__,
    };
  }

  static deserialize({ __type, colors, transform }: JSONObject) {
    if (__type === Checkers.__name__) {
      return new Checkers({
        transform: Matrix.deserialize(transform),
        colors: colors.map(Color.deserialize),
      });
    }

    throw new Error("Cannot deserialize object.");
  }
}
