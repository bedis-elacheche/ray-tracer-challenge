import { mod } from "../../../core";
import { PatternDeserializer } from "../xyz-patterns";
import { UVPattern } from "./uv-pattern";

export class UVCheckersPattern extends UVPattern {
  public static readonly __name__ = "uv-checkers-pattern";

  colorAt(u: number, v: number) {
    const u2 = Math.floor(u * this.width);
    const v2 = Math.floor(v * this.height);

    const pattern = mod(u2 + v2, 2) === 0 ? this.patterns[0] : this.patterns[1];

    return pattern.colorAt(u, v);
  }

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      __type: UVCheckersPattern.__name__,
    };
  }

  static deserialize({ __type, patterns, height, width }: JSONObject) {
    if (__type === UVCheckersPattern.__name__) {
      return new UVCheckersPattern({
        height,
        width,
        patterns: patterns.map(PatternDeserializer.deserialize),
      });
    }

    throw new Error("Cannot deserialize object.");
  }
}
