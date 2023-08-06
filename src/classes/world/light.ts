import { Point, Vector } from "../core";
import { Color, Material } from "../materials";
import { Shape } from "../shapes";

export class Light {
  public position: Point;
  public intensity: Color;

  constructor(position: Point, intensity: Color) {
    this.position = position;
    this.intensity = intensity;
  }

  apply(
    material: Material,
    object: Shape,
    point: Point,
    eye: Vector,
    normal: Vector,
    inShadow: boolean,
  ) {
    const color = material.pattern
      ? material.pattern.colorAt(point, object)
      : material.color;
    const effectiveColor = color.multiply(this.intensity);
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

    return inShadow ? ambient : ambient.add(diffuse).add(specular);
  }

  equals(l: Light) {
    if (this === l) {
      return true;
    }

    return (
      this.position.equals(l.position) && this.intensity.equals(l.intensity)
    );
  }
}
