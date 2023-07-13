import { Vector } from "./vector";

export class Environment {
  public gravity: Vector;
  public wind: Vector;

  constructor(g: Vector, w: Vector) {
    this.gravity = g;
    this.wind = w;
  }
}
