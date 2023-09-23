import { Noise } from "./noise";
import { OctavePerlinNoise } from "./octave-perlin";
import { PerlinNoise } from "./perlin";

export class NoiseDeserializer {
  static deserialize(item: JSONObject): Noise {
    switch (item.__type) {
      case PerlinNoise.__name__:
        return PerlinNoise.deserialize(item);
      case OctavePerlinNoise.__name__:
        return OctavePerlinNoise.deserialize(item);
      default:
        throw new Error("Pattern type not recognized.");
    }
  }
}
