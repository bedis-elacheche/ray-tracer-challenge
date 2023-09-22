import { EPSILON, Matrix, mod, Point } from "../../../core";
import { PatternDeserializer } from "../pattern-deserializer";
import { XYZPattern } from "./xyz-pattern";

export class StripesPattern extends XYZPattern {
  public static readonly __name__ = "stripes-pattern";

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      __type: StripesPattern.__name__,
    };
  }

  static deserialize({ __type, patterns, transform }: JSONObject) {
    if (__type === StripesPattern.__name__) {
      return new StripesPattern({
        transform: Matrix.deserialize(transform),
        patterns: patterns.map(PatternDeserializer.deserialize),
      });
    }

    throw new Error("Cannot deserialize object.");
  }

  localColorAt(p: Point) {
    const pattern =
      mod(Math.floor(p.x), 2) <= EPSILON ? this.patterns[0] : this.patterns[1];

    if (pattern instanceof XYZPattern) {
      return pattern.colorAt(pattern.transform.inverse().multiply(p));
    }

    return pattern.colorAt(p);
  }
}
