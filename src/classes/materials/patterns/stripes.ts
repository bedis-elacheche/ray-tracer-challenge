import { Matrix, Point } from "../../core";
import { Color } from "../color";
import { Pattern } from "./pattern";

export class Stripes extends Pattern {
  public static readonly __name__ = "stripes";

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

    return Math.floor(p.x) % 2 ? b : a;
  }
}
