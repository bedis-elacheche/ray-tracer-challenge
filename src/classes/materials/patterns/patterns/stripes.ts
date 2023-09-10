import { EPSILON, Matrix, mod, Point } from "../../../core";
import { Color } from "../../color";
import { Pattern } from "./pattern";

export class Stripes extends Pattern {
  public static readonly __name__ = "stripes-pattern";

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      __type: Stripes.__name__,
    };
  }

  static deserialize({ __type, colors, transform }: JSONObject) {
    if (__type === Stripes.__name__) {
      return new Stripes({
        transform: Matrix.deserialize(transform),
        colors: colors.map(Color.deserialize),
      });
    }

    throw new Error("Cannot deserialize object.");
  }

  localColorAt(p: Point): Color {
    const [a, b] = this.colors;

    return mod(Math.floor(p.x), 2) <= EPSILON ? a : b;
  }
}
