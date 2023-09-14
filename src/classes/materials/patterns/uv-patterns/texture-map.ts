import { Point, Transformations } from "../../../core";
import { BaseShape } from "../../../shapes";
import { Color } from "../../color";
import { BasePattern } from "../abstract";
import { Face, UVMap, UVMapType } from "./uv-mapper";
import { UVPattern } from "./uv-pattern";
import { UVPatternDeserializer } from "./uv-pattern-deserializer";

type CubicTextureMapProps = {
  patterns: {
    left: UVPattern;
    right: UVPattern;
    front: UVPattern;
    back: UVPattern;
    up: UVPattern;
    down: UVPattern;
    main?: never;
  };
  map: "cubic";
};

type GenericTextureMapProps = {
  patterns: {
    main: UVPattern;
  };
  map: Exclude<UVMapType, "cubic">;
};

type TextureMapProps = GenericTextureMapProps | CubicTextureMapProps;

export class TextureMap implements BasePattern {
  public static readonly __name__ = "texture-map";
  public patterns: TextureMapProps["patterns"];
  public map: UVMapType;

  constructor({ patterns, map }: TextureMapProps) {
    this.map = map;
    this.patterns = patterns;
  }

  colorAt(p: Point, s?: BaseShape): Color {
    const objectPoint = s ? Transformations.worldToObject(s, p) : p;
    const [[u, v], face] = UVMap.map(objectPoint, this.map);
    const pattern = this.getPattern(face);

    return pattern.colorAt(u, v);
  }

  isCubicTextureMap(): this is this & CubicTextureMapProps {
    return this.map === "cubic";
  }

  private getPattern(face: string) {
    if (this.isCubicTextureMap()) {
      switch (face) {
        case Face.LEFT:
          return this.patterns.left;
        case Face.RIGHT:
          return this.patterns.right;
        case Face.FRONT:
          return this.patterns.front;
        case Face.BACK:
          return this.patterns.back;
        case Face.UP:
          return this.patterns.up;
        default:
          return this.patterns.down;
      }
    }

    return this.patterns.main;
  }

  serialize(): JSONObject {
    return {
      __type: TextureMap.__name__,
      patterns: Object.entries(this.patterns).reduce<
        Record<string, JSONObject>
      >(
        (acc, [key, pattern]) => ({
          ...acc,
          [key]: pattern.serialize(),
        }),
        {},
      ),
      map: this.map,
    };
  }

  static deserialize({ __type, patterns, map }: JSONObject): TextureMap {
    if (__type === TextureMap.__name__) {
      const { left, right, front, back, up, down, main } = patterns;

      return new TextureMap(
        map === "cubic"
          ? {
              map: "cubic",
              patterns: {
                right: UVPatternDeserializer.deserialize(right),
                left: UVPatternDeserializer.deserialize(left),
                front: UVPatternDeserializer.deserialize(front),
                back: UVPatternDeserializer.deserialize(back),
                up: UVPatternDeserializer.deserialize(up),
                down: UVPatternDeserializer.deserialize(down),
              },
            }
          : {
              map,
              patterns: {
                main: UVPatternDeserializer.deserialize(main),
              },
            },
      );
    }

    throw new Error("Cannot deserialize object.");
  }

  equals(p: TextureMap) {
    if (p === this) {
      return true;
    }

    return (
      this.map === p.map &&
      Object.entries(this.patterns).every(
        ([key, pattern]: [keyof TextureMapProps["patterns"], UVPattern]) => {
          const otherPattern: UVPattern = p.patterns[key];

          if (!otherPattern) {
            return false;
          }

          return pattern.equals(otherPattern);
        },
      )
    );
  }
}
