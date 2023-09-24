import { Serializable } from "../../../core";
import { Color } from "../../color";
import { SolidPattern } from "../solid-pattern";

export type UVPatternPatternType = UVPattern | SolidPattern;

export class UVPattern implements Serializable {
  public static __name__ = "uv-pattern";
  public patterns: UVPatternPatternType[];
  public width: number;
  public height: number;

  constructor({
    width = 1,
    height = 1,
    patterns = [SolidPattern.Black(), SolidPattern.White()],
  }: {
    width?: number;
    height?: number;
    patterns?: UVPatternPatternType[];
  } = {}) {
    this.patterns = patterns;
    this.height = height;
    this.width = width;
  }

  serialize(): JSONObject {
    return {
      __type: UVPattern.__name__,
      patterns: this.patterns.map((pattern) => pattern.serialize()),
      height: this.height,
      width: this.width,
    };
  }

  static deserialize(_json: JSONObject): UVPattern {
    throw new Error("Cannot deserialize object.");
  }

  colorAt(_u: number, _v: number) {
    return new Color(0, 0, 0);
  }

  equals(p: UVPattern): boolean {
    if (p === this) {
      return true;
    }

    return (
      this.constructor.name === p.constructor.name &&
      this.width === p.width &&
      this.height === p.height &&
      this.patterns.every((pattern, i) => {
        const otherPattern = p.patterns[i];

        if (pattern instanceof UVPattern && otherPattern instanceof UVPattern) {
          return pattern.equals(otherPattern);
        }

        if (
          pattern instanceof SolidPattern &&
          otherPattern instanceof SolidPattern
        ) {
          return pattern.equals(otherPattern);
        }

        return false;
      })
    );
  }
}
