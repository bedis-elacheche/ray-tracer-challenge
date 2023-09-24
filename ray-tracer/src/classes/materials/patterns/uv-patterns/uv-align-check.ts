import { PatternDeserializer } from "../xyz-patterns";
import { UVPattern, UVPatternPatternType } from "./uv-pattern";

export class UVAlignCheckPattern extends UVPattern {
  public static readonly __name__ = "uv-align-check-pattern";

  constructor({
    main,
    ul,
    ur,
    bl,
    br,
  }: {
    main: UVPatternPatternType;
    ul: UVPatternPatternType;
    ur: UVPatternPatternType;
    bl: UVPatternPatternType;
    br: UVPatternPatternType;
  }) {
    super({
      patterns: [main, ul, ur, bl, br],
    });
  }

  colorAt(u: number, v: number) {
    if (v > 0.8) {
      if (u < 0.2) {
        return this.patterns[1].colorAt(u, v);
      }

      if (u > 0.8) {
        return this.patterns[2].colorAt(u, v);
      }
    }

    if (v < 0.2) {
      if (u < 0.2) {
        return this.patterns[3].colorAt(u, v);
      }

      if (u > 0.8) {
        return this.patterns[4].colorAt(u, v);
      }
    }

    return this.patterns[0].colorAt(u, v);
  }

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      __type: UVAlignCheckPattern.__name__,
    };
  }

  static deserialize({ __type, patterns }: JSONObject) {
    const [main, ul, ur, bl, br] = patterns.map(
      PatternDeserializer.deserialize,
    );

    if (__type === UVAlignCheckPattern.__name__) {
      return new UVAlignCheckPattern({
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
