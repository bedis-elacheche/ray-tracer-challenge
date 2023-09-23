import { clamp, EPSILON, Serializable } from "../core";
import { Pattern, PatternDeserializer, SolidPattern } from "./patterns";

export class Material implements Serializable {
  public static readonly __name__ = "material";
  public pattern: Pattern;
  public ambient: number;
  public diffuse: number;
  public specular: number;
  public shininess: number;
  public refractiveIndex: number;
  public transparency: number;
  public reflective: number;

  constructor({
    pattern = new SolidPattern(),
    ambient = 0.1,
    diffuse = 0.9,
    specular = 0.9,
    shininess = 200,
    reflective = 0.0,
    transparency = 0.0,
    refractiveIndex = 1.0,
  }: {
    ambient?: number;
    diffuse?: number;
    specular?: number;
    pattern?: Pattern;
    shininess?: number;
    reflective?: number;
    transparency?: number;
    refractiveIndex?: number;
  } = {}) {
    this.pattern = pattern;
    this.shininess = shininess;
    this.ambient = clamp(0, 1, ambient);
    this.diffuse = clamp(0, 1, diffuse);
    this.specular = clamp(0, 1, specular);
    this.refractiveIndex = refractiveIndex;
    this.reflective = clamp(0, 1, reflective);
    this.transparency = clamp(0, 1, transparency);
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
      pattern: this.pattern.serialize(),
    };
  }

  static deserialize({
    __type,
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
        pattern: PatternDeserializer.deserialize(pattern),
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

    return (
      this.pattern.equals(m.pattern) &&
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
