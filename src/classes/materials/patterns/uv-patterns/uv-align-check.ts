import { Color } from "../../color";
import { UVPattern } from "./uv-pattern";

export class UVAlignCheck extends UVPattern {
  public static readonly __name__ = "uv-align-check-pattern";

  constructor({
    main,
    ul,
    ur,
    bl,
    br,
  }: {
    main: Color;
    ul: Color;
    ur: Color;
    bl: Color;
    br: Color;
  }) {
    super({
      colors: [main, ul, ur, bl, br],
    });
  }

  colorAt(u: number, v: number) {
    if (v > 0.8) {
      if (u < 0.2) {
        return this.colors[1];
      }

      if (u > 0.8) {
        return this.colors[2];
      }
    }

    if (v < 0.2) {
      if (u < 0.2) {
        return this.colors[3];
      }

      if (u > 0.8) {
        return this.colors[4];
      }
    }

    return this.colors[0];
  }

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      __type: UVAlignCheck.__name__,
    };
  }

  static deserialize({ __type, colors }: JSONObject) {
    const [main, ul, ur, bl, br] = colors.map(Color.deserialize);

    if (__type === UVAlignCheck.__name__) {
      return new UVAlignCheck({
        main,
        ul,
        ur,
        bl,
        br,
      });
    }

    throw new Error("Cannot deserialize object.");
  }
}
