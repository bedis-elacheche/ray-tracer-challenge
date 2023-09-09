import { Matrix, Point } from "../core";
import { Ray } from "../engine";
import { checkAxis } from "./utils";

export class BoundingBox {
  public min: Point;
  public max: Point;

  constructor({
    min = new Point(Infinity, Infinity, Infinity),
    max = new Point(-Infinity, -Infinity, -Infinity),
  }: {
    min?: Point;
    max?: Point;
  } = {}) {
    this.min = min;
    this.max = max;
  }

  add(b: BoundingBox): void;
  add(p: Point): void;
  add(item: BoundingBox | Point) {
    if (item instanceof Point) {
      this.min = Point.min(this.min, item);
      this.max = Point.max(this.max, item);
    } else {
      this.add(item.min);
      this.add(item.max);
    }
  }

  contains(b: BoundingBox): boolean;
  contains(p: Point): boolean;
  contains(item: BoundingBox | Point) {
    if (item instanceof BoundingBox) {
      return this.contains(item.min) && this.contains(item.max);
    }

    return (
      item.x >= this.min.x &&
      item.x <= this.max.x &&
      item.y >= this.min.y &&
      item.y <= this.max.y &&
      item.z >= this.min.z &&
      item.z <= this.max.z
    );
  }

  transform(matrix: Matrix) {
    const p1 = this.min;
    const p2 = new Point(this.min.x, this.min.y, this.max.z);
    const p3 = new Point(this.min.x, this.max.y, this.min.z);
    const p4 = new Point(this.min.x, this.max.y, this.max.z);
    const p5 = new Point(this.max.x, this.min.y, this.min.z);
    const p6 = new Point(this.max.x, this.min.y, this.max.z);
    const p7 = new Point(this.max.x, this.max.y, this.min.z);
    const p8 = this.max;

    const bbox = new BoundingBox();

    for (const p of [p1, p2, p3, p4, p5, p6, p7, p8]) {
      bbox.add(matrix.multiply(p));
    }

    return bbox;
  }

  intersect(ray: Ray): boolean {
    const [xtmin, xtmax] = checkAxis(
      ray.origin.x,
      ray.direction.x,
      this.min.x,
      this.max.x,
    );
    const [ytmin, ytmax] = checkAxis(
      ray.origin.y,
      ray.direction.y,
      this.min.y,
      this.max.y,
    );
    const [ztmin, ztmax] = checkAxis(
      ray.origin.z,
      ray.direction.z,
      this.min.z,
      this.max.z,
    );
    const tmin = Math.max(xtmin, ytmin, ztmin);
    const tmax = Math.min(xtmax, ytmax, ztmax);

    if (tmin > tmax) {
      return false;
    }

    return true;
  }

  split() {
    const dx = this.max.x - this.min.x;
    const dy = this.max.y - this.min.y;
    const dz = this.max.z - this.min.z;
    const greatest = Math.max(dx, dy, dz);
    let { x: x0, y: y0, z: z0 } = this.min;
    let { x: x1, y: y1, z: z1 } = this.max;

    if (greatest === dx) {
      x0 = x1 = x0 + dx / 2;
    } else if (greatest === dy) {
      y0 = y1 = y0 + dy / 2;
    } else {
      z0 = z1 = z0 + dz / 2;
    }

    const midMin = new Point(x0, y0, z0);
    const midMax = new Point(x1, y1, z1);
    const left = new BoundingBox({ min: this.min, max: midMax });
    const right = new BoundingBox({ min: midMin, max: this.max });

    return [left, right];
  }
}
