import { Point } from "../core";
import { World } from "../engine";
import { Light } from "./light";

export class PointLight extends Light {
  intensityAt(point: Point, world: World): number {
    const isShadowed = world.isShadowed(point, this.position);

    return isShadowed ? 0 : 1;
  }
}
