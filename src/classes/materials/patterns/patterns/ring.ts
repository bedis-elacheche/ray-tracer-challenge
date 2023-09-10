import { EPSILON, Matrix, mod, Point } from "../../../core";
import { Color } from "../../color";
import { Pattern } from "./pattern";

export class Ring extends Pattern {
  public static readonly __name__ = "ring-pattern";

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      __type: Ring.__name__,
    };
  }

  static deserialize({ __type, colors, transform }: JSONObject) {
    if (__type === Ring.__name__) {
      return new Ring({
        transform: Matrix.deserialize(transform),
        colors: colors.map(Color.deserialize),
      });
    }

    throw new Error("Cannot deserialize object.");
  }

  localColorAt(p: Point): Color {
    const [a, b] = this.colors;

    return mod(Math.floor(Math.sqrt(p.x ** 2 + p.z ** 2)), 2) <= EPSILON
      ? a
      : b;
  }
}
