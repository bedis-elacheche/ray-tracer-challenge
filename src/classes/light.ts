import { Color } from "./color";
import { Material } from "./material";
import { Point } from "./point";
import { Vector } from "./vector";

export class Light {
  public position: Point;
  public intensity: Color;

  constructor(position: Point, intensity: Color) {
    this.position = position;
    this.intensity = intensity;
  }

  apply(material: Material, point: Point, eye: Vector, normal: Vector) {
    const effectiveColor = material.color.multiply(this.intensity);
    const lightVector = this.position.subtract(point).normalize();
    const ambient = effectiveColor.multiply(material.ambient);
    const lightDotNormal = lightVector.dot(normal);
    const black = new Color(0, 0, 0);
    let diffuse: Color;
    let specular: Color;

    if (lightDotNormal < 0) {
      diffuse = black;
      specular = black;
    } else {
      diffuse = effectiveColor.multiply(material.diffuse * lightDotNormal);
      const reflectVector = lightVector.negate().reflect(normal);
      const reflectDotEye = reflectVector.dot(eye);

      if (reflectDotEye <= 0) {
        specular = black;
      } else {
        const factor = reflectDotEye ** material.shininess;
        specular = this.intensity.multiply(material.specular * factor);
      }
    }

    return ambient.add(diffuse).add(specular);
  }
}
