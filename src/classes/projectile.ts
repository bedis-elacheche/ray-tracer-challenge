import { Point } from "./point";
import { Vector } from "./vector";

export class Projectile {
  public position: Point;
  public velocity: Vector;

  constructor(p: Point, v: Vector) {
    this.position = p;
    this.velocity = v;
  }
}
