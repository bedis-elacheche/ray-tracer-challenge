import { Matrix, Point } from "../../../core";
import { PatternDeserializer } from "../pattern-deserializer";
import { XYZPattern } from "./xyz-pattern";

export class BlendedPattern extends XYZPattern {
  public static readonly __name__ = "blended-pattern";

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      __type: BlendedPattern.__name__,
    };
  }

  static deserialize({ __type, patterns, transform }: JSONObject) {
    if (__type === BlendedPattern.__name__) {
      return new BlendedPattern({
        transform: Matrix.deserialize(transform),
        patterns: patterns.map(PatternDeserializer.deserialize),
      });
    }

    throw new Error("Cannot deserialize object.");
  }

  localColorAt(p: Point) {
    const [from, to] = this.patterns;
    const a =
      from instanceof XYZPattern
        ? from.colorAt(from.transform.inverse().multiply(p))
        : from.colorAt(p);
    const b =
      to instanceof XYZPattern
        ? to.colorAt(to.transform.inverse().multiply(p))
        : to.colorAt(p);

    return a.add(b).divide(2);
  }
}
