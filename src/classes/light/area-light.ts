import { Point, Vector } from "../core";
import { World } from "../engine";
import { Color, Material } from "../materials";
import { BaseShape } from "../shapes";
import { sequence } from "../utils";
import { Light, LightProps } from "./light";

export class AreaLight extends Light {
  public corner: Point;
  public uvec: Vector;
  public usteps: number;
  public vvec: Vector;
  public vsteps: number;
  public samples: number;
  public jitter: boolean;
  public jitterBy: Generator<number, number, unknown>;

  constructor({
    corner,
    intensity,
    uvec,
    usteps,
    vvec,
    vsteps,
    jitter = false,
  }: LightProps & {
    corner: Point;
    uvec: Vector;
    usteps: number;
    vvec: Vector;
    vsteps: number;
    jitter?: boolean;
  }) {
    super({ intensity });

    this.corner = corner;
    this.uvec = uvec.divide(usteps);
    this.usteps = usteps;
    this.vvec = vvec.divide(vsteps);
    this.vsteps = vsteps;
    this.samples = usteps * vsteps;
    this.jitter = jitter;
    this.jitterBy = jitter
      ? sequence(
          ...Array.from(
            { length: 10 },
            () => (Math.random() / 2) * (Math.random() > 0.5 ? 1 : -1),
          ),
        )
      : sequence(0.5);
  }

  apply(
    material: Material,
    object: BaseShape<unknown>,
    point: Point,
    eye: Vector,
    normal: Vector,
    shadowIntensity: number,
  ): Color {
    const color = material.pattern
      ? material.pattern.colorAt(point, object)
      : material.color;
    const effectiveColor = color.multiply(this.intensity);
    const ambient = effectiveColor.multiply(material.ambient);
    const black = new Color(0, 0, 0);
    let sum = black;

    for (let v = 0; v < this.vsteps; v++) {
      for (let u = 0; u < this.usteps; u++) {
        const samplePosition = this.pointOnLight(u, v);
        const lightVector = samplePosition.subtract(point).normalize();
        const lightDotNormal = lightVector.dot(normal);

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

        sum = sum.add(diffuse).add(specular);
      }
    }

    return ambient.add(sum.divide(this.samples).multiply(shadowIntensity));
  }

  intensityAt(point: Point, world: World): number {
    let total = 0;

    for (let v = 0; v < this.vsteps; v++) {
      for (let u = 0; u < this.usteps; u++) {
        const position = this.pointOnLight(u, v);

        if (!world.isShadowed(point, position)) {
          total++;
        }
      }
    }

    return total / this.samples;
  }

  pointOnLight(u: number, v: number) {
    return this.corner
      .add(this.uvec.multiply(u + this.jitterBy.next().value))
      .add(this.vvec.multiply(v + this.jitterBy.next().value));
  }

  equals(l: AreaLight) {
    if (this === l) {
      return true;
    }

    return (
      super.equals(l) &&
      this.corner.equals(l.corner) &&
      this.uvec.equals(l.uvec) &&
      this.usteps === l.usteps &&
      this.vvec.equals(l.vvec) &&
      this.vsteps === l.vsteps
    );
  }
}