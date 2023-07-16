import { EPSILON } from "../constants";
import { Color } from "./color";

export class Material {
  public color: Color;
  public ambient: number;
  public diffuse: number;
  public specular: number;
  public shininess: number;
  public refractiveIndex: number;
  public transparency: number;
  public reflective: number;

  constructor() {
    this.color = new Color(1, 1, 1);
    this.ambient = 0.1;
    this.diffuse = 0.9;
    this.specular = 0.9;
    this.shininess = 200;
    this.reflective = 0.0;
    this.transparency = 0.0;
    this.refractiveIndex = 1.0;
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
