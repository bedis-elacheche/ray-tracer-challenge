import { Matrix } from "./matrix";
import { Shape } from "./shape";

export class Sphere extends Shape {
  constructor() {
    super();
    this.transform = Matrix.identity(4);
  }
}
