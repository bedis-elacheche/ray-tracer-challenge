import { EPSILON, Matrix, mod, Point } from "../../../core";
import { PatternDeserializer } from "../pattern-deserializer";
import { XYZPattern } from "./xyz-pattern";

export class RingPattern extends XYZPattern {
  public static readonly __name__ = "ring-pattern";

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      __type: RingPattern.__name__,
    };
  }

  static deserialize({ __type, patterns, transform }: JSONObject) {
    if (__type === RingPattern.__name__) {
      return new RingPattern({
        transform: Matrix.deserialize(transform),
        patterns: patterns.map(PatternDeserializer.deserialize),
      });
    }

    throw new Error("Cannot deserialize object.");
  }

  localColorAt(p: Point) {
    const pattern =
      mod(Math.floor(Math.sqrt(p.x ** 2 + p.z ** 2)), 2) <= EPSILON
        ? this.patterns[0]
        : this.patterns[1];

    if (pattern instanceof XYZPattern) {
      return pattern.colorAt(pattern.transform.inverse().multiply(p));
    }

    return pattern.colorAt(p);
  }
}
