import { clamp, Matrix, Noise, NoiseDeserializer, Point } from "../../../core";
import { Pattern } from "../pattern";
import { PatternDeserializer } from "../pattern-deserializer";
import { XYZPattern } from "./xyz-pattern";

export class PerturbedPattern extends XYZPattern {
  public static readonly __name__ = "perturbed-pattern";
  public noise: Noise;
  public scale: number;

  constructor({
    noise,
    transform,
    pattern,
    scale = 0.25,
  }: {
    pattern: Pattern;
    noise: Noise;
    scale?: number;
    transform?: Matrix;
  }) {
    super({ transform, patterns: [pattern] });

    this.noise = noise;
    this.scale = clamp(0, 1, scale);
  }

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      __type: PerturbedPattern.__name__,
      noise: this.noise.serialize(),
      scale: this.scale,
    };
  }

  static deserialize({
    __type,
    patterns,
    transform,
    noise,
    scale,
  }: JSONObject) {
    if (__type === PerturbedPattern.__name__) {
      return new PerturbedPattern({
        transform: Matrix.deserialize(transform),
        pattern: PatternDeserializer.deserialize(patterns[0]),
        noise: NoiseDeserializer.deserialize(noise),
        scale: parseFloat(scale),
      });
    }

    throw new Error("Cannot deserialize object.");
  }

  localColorAt(p: Point) {
    const pattern = this.patterns[0];
    const jitteredPoint = this.noise.jitter(
      pattern instanceof XYZPattern
        ? pattern.transform.inverse().multiply(p)
        : p,
      this.scale,
    );

    return pattern.colorAt(jitteredPoint);
  }
}
