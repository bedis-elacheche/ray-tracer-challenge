import { Face, Point, Transformations, UVMap, UVMapType } from "../../../core";
import { BaseShape } from "../../../shapes";
import { Color } from "../../color";
import { Pattern } from "../pattern";
import { SolidPattern } from "../solid-pattern";
import { UVPattern, UVPatternPatternType } from "./uv-pattern";
import { UVPatternDeserializer } from "./uv-pattern-deserializer";

type CubicTextureMapPatternProps = {
  patterns: {
    left: UVPatternPatternType;
    right: UVPatternPatternType;
    front: UVPatternPatternType;
    back: UVPatternPatternType;
    up: UVPatternPatternType;
    down: UVPatternPatternType;
    main?: never;
  };
  map: "cubic";
};

type GenericTextureMapPatternProps = {
  patterns: {
    main: UVPatternPatternType;
  };
  map: Exclude<UVMapType, "cubic">;
};

type TextureMapPatternProps =
  | GenericTextureMapPatternProps
  | CubicTextureMapPatternProps;

export class TextureMapPattern implements Pattern {
  public static readonly __name__ = "texture-map";
  public patterns: TextureMapPatternProps["patterns"];
  public map: UVMapType;

  constructor({ patterns, map }: TextureMapPatternProps) {
    this.map = map;
    this.patterns = patterns;
  }

  colorAt(p: Point, s?: BaseShape): Color {
    const objectPoint = s ? Transformations.worldToObject(s, p) : p;
    const [[u, v], face] = UVMap.map(objectPoint, this.map);
    const pattern = this.getPattern(face);

    if (pattern instanceof UVPattern) {
      return pattern.colorAt(u, v);
    }

    return pattern.colorAt(objectPoint);
  }

  isCubicTextureMap(): this is this & CubicTextureMapPatternProps {
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
      __type: TextureMapPattern.__name__,
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

  static deserialize({ __type, patterns, map }: JSONObject): TextureMapPattern {
    if (__type === TextureMapPattern.__name__) {
      const { left, right, front, back, up, down, main } = patterns;

      return new TextureMapPattern(
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

  equals(p: TextureMapPattern) {
    if (p === this) {
      return true;
    }

    return (
      this.map === p.map &&
      Object.entries(this.patterns).every(
        ([key, pattern]: [
          keyof TextureMapPatternProps["patterns"],
          UVPatternPatternType,
        ]) => {
          const otherPattern: UVPatternPatternType = p.patterns[key];

          if (!otherPattern) {
            return false;
          }

          if (
            pattern instanceof UVPattern &&
            otherPattern instanceof UVPattern
          ) {
            return pattern.equals(otherPattern);
          }

          if (
            pattern instanceof SolidPattern &&
            otherPattern instanceof SolidPattern
          ) {
            return pattern.equals(otherPattern);
          }

          return false;
        },
      )
    );
  }
}
