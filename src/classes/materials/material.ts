import { EPSILON, Serializable } from "../core";
import { Color } from "./color";
import { Pattern, PatternDeserializer } from "./patterns";

export class Material implements Serializable {
  public static readonly __name__ = "material";
  public color: Color | null;
  public pattern: Pattern | null;
  public ambient: number;
  public diffuse: number;
  public specular: number;
  public shininess: number;
  public refractiveIndex: number;
  public transparency: number;
  public reflective: number;

  constructor({
    color = new Color(1, 1, 1),
    pattern = null,
    ambient = 0.1,
    diffuse = 0.9,
    specular = 0.9,
    shininess = 200,
    reflective = 0.0,
    transparency = 0.0,
    refractiveIndex = 1.0,
  }: {
    color?: Color;
    ambient?: number;
    diffuse?: number;
    specular?: number;
    pattern?: Pattern;
    shininess?: number;
    reflective?: number;
    transparency?: number;
    refractiveIndex?: number;
  } = {}) {
    this.color = color;
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.pattern = pattern;
    this.specular = specular;
    this.shininess = shininess;
    this.reflective = reflective;
    this.transparency = transparency;
    this.refractiveIndex = refractiveIndex;
  }

  static Glass() {
    return new Material({
      transparency: 1,
      refractiveIndex: 1.5,
    });
  }

  serialize(): JSONObject {
    return {
      __type: Material.__name__,
      ambient: this.ambient,
      diffuse: this.diffuse,
      specular: this.specular,
      shininess: this.shininess,
      reflective: this.reflective,
      transparency: this.transparency,
      refractiveIndex: this.refractiveIndex,
      color: this.color && this.color.serialize(),
      pattern: this.pattern && this.pattern.serialize(),
    };
  }

  static deserialize({
    __type,
    color,
    pattern,
    ambient,
    diffuse,
    specular,
    shininess,
    reflective,
    transparency,
    refractiveIndex,
  }: JSONObject) {
    if (__type === Material.__name__) {
      return new Material({
        color: Color.deserialize(color),
        pattern: pattern && PatternDeserializer.deserialize(pattern),
        ambient,
        diffuse,
        specular,
        shininess,
        reflective,
        transparency,
        refractiveIndex,
      });
    }

    throw new Error("Cannot deserialize object.");
  }

  equals(m: Material) {
    if (this === m) {
      return true;
    }

    const areColorsEqual = Boolean(
      (!this.color && !m.color) ||
        (this.color && m.color && this.color.equals(m.color)),
    );
    const arePatternsEqual = Boolean(
      (!this.pattern && !m.pattern) ||
        (this.pattern && m.pattern && this.pattern.equals(m.pattern)),
    );

    return (
      areColorsEqual &&
      arePatternsEqual &&
      Math.abs(this.ambient - m.ambient) <= EPSILON &&
      Math.abs(this.diffuse - m.diffuse) <= EPSILON &&
      Math.abs(this.specular - m.specular) <= EPSILON &&
      Math.abs(this.shininess - m.shininess) <= EPSILON &&
      Math.abs(this.reflective - m.reflective) <= EPSILON &&
      Math.abs(this.transparency - m.transparency) <= EPSILON &&
      Math.abs(this.refractiveIndex - m.refractiveIndex) <= EPSILON
    );
  }
}
