import { Matrix, Point } from "../core";
import { Canvas } from "./canvas";
import { Ray } from "./ray";
import { World } from "./world";

export class Camera {
  public hsize: number;
  public vsize: number;
  public fov: number;
  public pixelSize: number;
  public transform: Matrix;
  private _halfWidth: number;
  private _halfHeight: number;

  constructor(
    hsize: number,
    vsize: number,
    fov: number,
    transform = Matrix.identity(4),
  ) {
    this.hsize = hsize;
    this.vsize = vsize;
    this.fov = fov;
    this.transform = transform;

    const halfView = Math.tan(fov / 2);
    const aspectRatio = hsize / vsize;
    const [halfWidth, halfHeight] =
      aspectRatio >= 1
        ? [halfView, halfView / aspectRatio]
        : [halfView * aspectRatio, halfView];

    this.pixelSize = (halfWidth * 2) / hsize;
    this._halfWidth = halfWidth;
    this._halfHeight = halfHeight;
  }

  rayForPixel(x: number, y: number) {
    const xOffset = (x + 0.5) * this.pixelSize;
    const yOffset = (y + 0.5) * this.pixelSize;
    const worldX = this._halfWidth - xOffset;
    const worldY = this._halfHeight - yOffset;
    const invertedTransform = this.transform.inverse();
    const pixel = Point.from(
      invertedTransform.multiply(new Point(worldX, worldY, -1)),
    );
    const origin = Point.from(invertedTransform.multiply(new Point(0, 0, 0)));
    const direction = pixel.subtract(origin).normalize();

    return new Ray(origin, direction);
  }

  render(world: World) {
    const image = new Canvas(this.hsize, this.vsize);

    for (let y = 0; y < this.vsize; y++) {
      for (let x = 0; x < this.hsize; x++) {
        const ray = this.rayForPixel(x, y);
        const color = world.colorAt(ray);

        image.writePixel(x, y, color);
      }
    }

    return image;
  }
}
