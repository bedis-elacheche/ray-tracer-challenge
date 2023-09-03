import { EventEmitter, Matrix, Point, Serializable } from "../core";
import { Color } from "../materials";
import { Canvas } from "./canvas";
import { Ray } from "./ray";
import { World } from "./world";

export type CameraEvents = {
  "pixel-rendered": [x: number, y: number, color: Color];
  "image-rendered": [canvas: Canvas];
};

export class Camera extends EventEmitter<CameraEvents> implements Serializable {
  public static readonly __name__ = "camera";
  public height: number;
  public width: number;
  public fieldOfView: number;
  public pixelSize: number;
  public transform: Matrix;
  private _halfWidth: number;
  private _halfHeight: number;

  constructor({
    height,
    width,
    fieldOfView,
    transform = Matrix.identity(4),
  }: {
    height: number;
    width: number;
    fieldOfView: number;
    transform?: Matrix;
  }) {
    super();
    this.height = height;
    this.width = width;
    this.fieldOfView = fieldOfView;
    this.transform = transform;

    const halfView = Math.tan(fieldOfView / 2);
    const aspectRatio = height / width;
    const [halfWidth, halfHeight] =
      aspectRatio >= 1
        ? [halfView, halfView / aspectRatio]
        : [halfView * aspectRatio, halfView];

    this.pixelSize = (halfWidth * 2) / height;
    this._halfWidth = halfWidth;
    this._halfHeight = halfHeight;
  }

  serialize(): JSONObject {
    return {
      __type: Camera.__name__,
      width: this.width,
      height: this.height,
      fieldOfView: this.fieldOfView,
      transform: this.transform.serialize(),
    };
  }

  static deserialize({
    __type,
    height,
    width,
    fieldOfView,
    transform,
  }: JSONObject) {
    if (__type === Camera.__name__) {
      return new Camera({
        height: +height,
        width: +width,
        fieldOfView: +fieldOfView,
        transform: Matrix.deserialize(transform),
      });
    }

    throw new Error("Cannot deserialize object.");
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

  colorAt(world: World, x: number, y: number) {
    const ray = this.rayForPixel(x, y);

    return world.colorAt(ray);
  }

  render(world: World) {
    const image = new Canvas(this.width, this.height);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const color = this.colorAt(world, x, y);

        image.writePixel(x, y, color);

        this.emit("pixel-rendered", x, y, color);
      }
    }

    this.emit("image-rendered", image);

    return image;
  }

  equals(c: Camera) {
    if (c === this) {
      return true;
    }

    return (
      this.height === c.height &&
      this.width === c.width &&
      this.fieldOfView === c.fieldOfView &&
      this.pixelSize === c.pixelSize &&
      this._halfHeight === c._halfHeight &&
      this._halfWidth === c._halfWidth &&
      this.transform.equals(c.transform)
    );
  }
}
