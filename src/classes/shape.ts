import { Matrix } from "./matrix";

export class Shape {
  public transform: Matrix;

  equals(s: Shape) {
    if (this === s) {
      return true;
    }

    return this.transform && s.transform
      ? this.transform.equals(s.transform)
      : false;
  }
}
