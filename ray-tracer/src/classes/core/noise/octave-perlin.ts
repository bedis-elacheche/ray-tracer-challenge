import { Point } from "../point";
import { PerlinNoise } from "./perlin";

export class OctavePerlinNoise extends PerlinNoise {
  public static readonly __name__ = "octave-perlin-noise";
  public octaves: number;
  public persistence: number;

  constructor({
    permutations,
    octaves,
    persistence,
  }: {
    permutations?: number[];
    octaves: number;
    persistence: number;
  }) {
    super({ permutations });

    this.octaves = octaves;
    this.persistence = persistence;
  }

  noise(point: Point) {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;

    for (let i = 0; i < this.octaves; i++) {
      total += super.noise(point.multiply(frequency)) * amplitude;
      maxValue += amplitude;
      amplitude *= this.persistence;
      frequency *= 2;
    }

    return total / maxValue;
  }

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      __type: OctavePerlinNoise.__name__,
      octaves: this.octaves,
      persistence: this.persistence,
    };
  }

  static deserialize({
    __type,
    permutations,
    octaves,
    persistence,
  }: JSONObject) {
    if (__type === OctavePerlinNoise.__name__) {
      return new OctavePerlinNoise({
        permutations,
        persistence,
        octaves,
      });
    }

    throw new Error("Cannot deserialize object.");
  }
}
