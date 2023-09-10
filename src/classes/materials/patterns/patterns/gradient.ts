import { Matrix, Point } from "../../../core";
import { Color } from "../../color";
import { Pattern } from "./pattern";

export class Gradient extends Pattern {
  public static readonly __name__: "gradient-pattern";

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      __type: Gradient.__name__,
    };
  }

  static deserialize({ __type, colors, transform }: JSONObject) {
    if (__type === Gradient.__name__) {
      return new Gradient({
        transform: Matrix.deserialize(transform),
        colors: colors.map(Color.deserialize),
      });
    }

    throw new Error("Cannot deserialize object.");
  }

  localColorAt(p: Point): Color {
    const [a, b] = this.colors;
    const distance = b.subtract(a);
    const fraction = p.x - Math.floor(p.x);

    return a.add(distance.multiply(fraction));
  }
}
