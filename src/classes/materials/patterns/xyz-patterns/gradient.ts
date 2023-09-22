import { Matrix, Point } from "../../../core";
import { PatternDeserializer } from "../pattern-deserializer";
import { XYZPattern } from "./xyz-pattern";

export class GradientPattern extends XYZPattern {
  public static readonly __name__ = "gradient-pattern";

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      __type: GradientPattern.__name__,
    };
  }

  static deserialize({ __type, patterns, transform }: JSONObject) {
    if (__type === GradientPattern.__name__) {
      return new GradientPattern({
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
    const distance = b.subtract(a);
    const fraction = p.x - Math.floor(p.x);

    return a.add(distance.multiply(fraction));
  }
}
