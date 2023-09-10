import { Point, Transformations } from "../../../core";
import { BaseShape } from "../../../shapes";
import { Color } from "../../color";
import { BasePattern } from "../abstract";
import { UVMap, UVMapper } from "./uv-map";
import { UVPattern } from "./uv-pattern";
import { UVPatternDeserializer } from "./uv-pattern-deserializer";

export class TextureMap implements BasePattern {
  public static readonly __name__ = "texture-map";
  public pattern: UVPattern;
  public uvMapper: UVMapper;

  constructor({
    pattern,
    uvMapper,
  }: {
    pattern: UVPattern;
    uvMapper: UVMapper;
  }) {
    this.pattern = pattern;
    this.uvMapper = uvMapper;
  }

  colorAt(p: Point, s?: BaseShape): Color {
    const objectPoint = s ? Transformations.worldToObject(s, p) : p;
    const [u, v] = this.uvMapper(objectPoint);

    return this.pattern.colorAt(u, v);
  }

  serialize(): JSONObject {
    let map: string;

    switch (this.uvMapper) {
      case UVMap.spherical: {
        map = "spherical";
        break;
      }
      case UVMap.planar: {
        map = "planar";
        break;
      }
      case UVMap.cylindrical: {
        map = "cylindrical";
        break;
      }
    }

    return {
      __type: TextureMap.__name__,
      pattern: this.pattern.serialize(),
      map,
    };
  }

  static deserialize({ __type, pattern, map }: JSONObject): TextureMap {
    if (__type === TextureMap.__name__) {
      let uvMapper: UVMapper;

      switch (map) {
        case "spherical": {
          uvMapper = UVMap.spherical;
          break;
        }
        case "planar": {
          uvMapper = UVMap.planar;
          break;
        }
        case "cylindrical": {
          uvMapper = UVMap.cylindrical;
          break;
        }
        default: {
          throw "Not supported";
        }
      }

      return new TextureMap({
        pattern: UVPatternDeserializer.deserialize(pattern),
        uvMapper,
      });
    }

    throw new Error("Cannot deserialize object.");
  }

  equals(p: TextureMap) {
    if (p === this) {
      return true;
    }

    return this.uvMapper === p.uvMapper && this.pattern.equals(p.pattern);
  }
}
