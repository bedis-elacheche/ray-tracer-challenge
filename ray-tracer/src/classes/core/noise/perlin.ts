import { Point } from "../point";
import { lerp, mod } from "../utils";
import { Noise } from "./noise";

export class PerlinNoise extends Noise {
  public static __name__ = "perlin-noise";
  public permutations: number[];

  constructor({
    permutations,
  }: {
    permutations?: number[];
  } = {}) {
    super();

    if (permutations) {
      const isValid =
        permutations.length === 512 &&
        permutations.every((n) => n >= 0 && n <= 255);

      if (!isValid) {
        throw new Error("Invalid permutations");
      }

      this.permutations = permutations;
    } else {
      const seed = Array.from({ length: 256 }, (_, i) => i).sort(
        (_a, _b) => 0.5 - Math.random(),
      );

      this.permutations = Array.from(
        { length: 512 },
        (_, i) => seed[mod(i, 256)],
      );
    }
  }

  static fade(t: number) {
    return 6 * t ** 5 - 15 * t ** 4 + 10 * t ** 3;
  }

  static gradient(hash: number, x: number, y: number, z: number) {
    switch (hash & 0xf) {
      case 0x0:
        return x + y;
      case 0x1:
        return -x + y;
      case 0x2:
        return x - y;
      case 0x3:
        return -x - y;
      case 0x4:
        return x + z;
      case 0x5:
        return -x + z;
      case 0x6:
        return x - z;
      case 0x7:
        return -x - z;
      case 0x8:
        return y + z;
      case 0x9:
        return -y + z;
      case 0xa:
        return y - z;
      case 0xb:
        return -y - z;
      case 0xc:
        return y + x;
      case 0xd:
        return -y + z;
      case 0xe:
        return y - x;
      case 0xf:
        return -y - z;
      default:
        throw "This should never happen";
    }
  }

  hash(xi0: number, yi0: number, zi0: number) {
    const p = this.permutations;

    const xi1 = xi0 + 1;
    const yi1 = yi0 + 1;
    const zi1 = zi0 + 1;
    const aaa = p[p[p[xi0] + yi0] + zi0];
    const aba = p[p[p[xi0] + yi1] + zi0];
    const aab = p[p[p[xi0] + yi0] + zi1];
    const abb = p[p[p[xi0] + yi1] + zi1];
    const baa = p[p[p[xi1] + yi0] + zi0];
    const bba = p[p[p[xi1] + yi1] + zi0];
    const bab = p[p[p[xi1] + yi0] + zi1];
    const bbb = p[p[p[xi1] + yi1] + zi1];

    return {
      aaa,
      aba,
      aab,
      abb,
      baa,
      bba,
      bab,
      bbb,
    };
  }

  noise(point: Point) {
    const xi = Math.floor(point.x) & 255;
    const yi = Math.floor(point.y) & 255;
    const zi = Math.floor(point.z) & 255;
    const xf = point.x - Math.floor(point.x);
    const yf = point.y - Math.floor(point.y);
    const zf = point.z - Math.floor(point.z);
    const u = PerlinNoise.fade(xf);
    const v = PerlinNoise.fade(yf);
    const w = PerlinNoise.fade(zf);
    const { aaa, aba, aab, abb, baa, bba, bab, bbb } = this.hash(xi, yi, zi);

    const x1 = lerp(
      PerlinNoise.gradient(aaa, xf, yf, zf),
      PerlinNoise.gradient(baa, xf - 1, yf, zf),
      u,
    );
    const x2 = lerp(
      PerlinNoise.gradient(aba, xf, yf - 1, zf),
      PerlinNoise.gradient(bba, xf - 1, yf - 1, zf),
      u,
    );
    const y1 = lerp(x1, x2, v);

    const x3 = lerp(
      PerlinNoise.gradient(aab, xf, yf, zf - 1),
      PerlinNoise.gradient(bab, xf - 1, yf, zf - 1),
      u,
    );
    const x4 = lerp(
      PerlinNoise.gradient(abb, xf, yf - 1, zf - 1),
      PerlinNoise.gradient(bbb, xf - 1, yf - 1, zf - 1),
      u,
    );
    const y2 = lerp(x3, x4, v);

    return lerp(y1, y2, w);
  }

  jitter(p: Point, scale: number): Point {
    const noise = this.noise(p) * scale;

    return new Point(p.x + noise, p.y + noise, p.z + noise);
  }

  serialize(): JSONObject {
    return {
      __type: PerlinNoise.__name__,
      permutations: this.permutations,
    };
  }

  static deserialize({ __type, permutations }: JSONObject) {
    if (__type === PerlinNoise.__name__) {
      return new PerlinNoise({
        permutations,
      });
    }

    throw new Error("Cannot deserialize object.");
  }
}
