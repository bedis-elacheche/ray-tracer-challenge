import { Point, Vector } from "../core";

export class Projectile {
  public position: Point;
  public velocity: Vector;

  constructor(p: Point, v: Vector) {
    this.position = p;
    this.velocity = v;
  }
}
