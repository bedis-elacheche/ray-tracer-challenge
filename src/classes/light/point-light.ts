import { Point, Vector } from "../core";
import { World } from "../engine";
import { Color, Material } from "../materials";
import { BaseShape } from "../shapes";
import { Light, LightProps } from "./light";

export class PointLight extends Light {
  public position: Point;

  constructor({
    position,
    intensity,
  }: LightProps & {
    position: Point;
  }) {
    super({ intensity });

    this.position = position;
  }

  apply(
    material: Material,
    object: BaseShape,
    point: Point,
    eye: Vector,
    normal: Vector,
    shadowIntensity: number,
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

    return ambient
      .add(diffuse.multiply(shadowIntensity))
      .add(specular.multiply(shadowIntensity));
  }

  intensityAt(point: Point, world: World): number {
    const isShadowed = world.isShadowed(point, this.position);

    return isShadowed ? 0 : 1;
  }

  equals(l: PointLight) {
    if (this === l) {
      return true;
    }

    return super.equals(l) && this.position.equals(l.position);
  }
}
