import { Vector } from "../core";

export class Environment {
  public gravity: Vector;
  public wind: Vector;

  constructor(gravity: Vector, wind: Vector) {
    this.gravity = gravity;
    this.wind = wind;
  }
}
