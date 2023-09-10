import { Color } from "../../color";
import { UVPattern } from "./uv-pattern";

export class UVCheckers extends UVPattern {
  public static readonly __name__ = "uv-checkers-pattern";

  colorAt(u: number, v: number) {
    const u2 = Math.floor(u * this.width);
    const v2 = Math.floor(v * this.height);
    const [a, b] = this.colors;

    return (u2 + v2) % 2 ? b : a;
  }

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      __type: UVCheckers.__name__,
    };
  }

  static deserialize({ __type, colors, height, width }: JSONObject) {
    if (__type === UVCheckers.__name__) {
      return new UVCheckers({
        height,
        width,
        colors: colors.map(Color.deserialize),
      });
    }

    throw new Error("Cannot deserialize object.");
  }
}
