import { EPSILON } from "../core";
import { Color } from "./color";
import { Pattern } from "./patterns";

export class Material {
  public color: Color;
  public pattern: Pattern;
  public ambient: number;
  public diffuse: number;
  public specular: number;
  public shininess: number;
  public refractiveIndex: number;
  public transparency: number;
  public reflective: number;
  public hasShadow: boolean;

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
    hasShadow = true,
  }: {
    color?: Color;
    ambient?: number;
    diffuse?: number;
    specular?: number;
    pattern?: Pattern;
    shininess?: number;
    reflective?: number;
    hasShadow?: boolean;
    transparency?: number;
    refractiveIndex?: number;
  } = {}) {
    this.color = color;
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.pattern = pattern;
    this.specular = specular;
    this.shininess = shininess;
    this.hasShadow = hasShadow;
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

  equals(m: Material) {
    return (
      this.color.equals(m.color) &&
      Math.abs(this.ambient - m.ambient) <= EPSILON &&
      Math.abs(this.diffuse - m.diffuse) <= EPSILON &&
      Math.abs(this.specular - m.specular) <= EPSILON &&
      Math.abs(this.shininess - m.shininess) <= EPSILON
    );
  }
}
