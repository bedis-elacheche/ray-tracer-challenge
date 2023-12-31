import { Point, Serializable, Vector } from "../core";
import { World } from "../engine/world";
import { Color, Material } from "../materials";
import { BaseShape } from "../shapes";

export type LightProps = { intensity: Color };

export class Light implements Serializable {
  public static __name__ = "light";
  public intensity: Color;

  constructor({ intensity }: LightProps) {
    this.intensity = intensity;
  }

  serialize(): JSONObject {
    return {
      __type: Light.__name__,
      intensity: this.intensity.serialize(),
    };
  }

  static deserialize({ __type, intensity }: JSONObject) {
    if (__type === Light.__name__) {
      return new Light({
        intensity: Color.deserialize(intensity),
      });
    }

    throw new Error("Cannot deserialize object.");
  }

  apply(
    _material: Material,
    _object: BaseShape,
    _point: Point,
    _eye: Vector,
    _normal: Vector,
    _shadowIntensity: number,
  ): Color {
    throw "Cannot call this on an abstract light";
  }

  intensityAt(_point: Point, _world: World): number {
    throw "Cannot call this on an abstract light";
  }

  equals(l: Light) {
    if (this === l) {
      return true;
    }

    return (
      this.constructor.name === l.constructor.name &&
      this.intensity.equals(l.intensity)
    );
  }
}
