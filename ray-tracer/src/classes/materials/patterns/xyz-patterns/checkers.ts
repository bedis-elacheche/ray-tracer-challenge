import { EPSILON, Matrix, mod, Point } from "../../../core";
import { PatternDeserializer } from "../pattern-deserializer";
import { XYZPattern } from "./xyz-pattern";

export class CheckersPattern extends XYZPattern {
  public static readonly __name__ = "checkers-pattern";

  localColorAt(p: Point) {
    const pattern =
      mod(Math.floor(p.x) + Math.floor(p.y) + Math.floor(p.z), 2) <= EPSILON
        ? this.patterns[0]
        : this.patterns[1];

    if (pattern instanceof XYZPattern) {
      return pattern.colorAt(pattern.transform.inverse().multiply(p));
    }

    return pattern.colorAt(p);
  }

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      __type: CheckersPattern.__name__,
    };
  }

  static deserialize({ __type, patterns, transform }: JSONObject) {
    if (__type === CheckersPattern.__name__) {
      return new CheckersPattern({
        transform: Matrix.deserialize(transform),
        patterns: patterns.map(PatternDeserializer.deserialize),
      });
    }

    throw new Error("Cannot deserialize object.");
  }
}
