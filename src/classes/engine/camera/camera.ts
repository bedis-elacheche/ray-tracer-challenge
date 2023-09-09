import path from "node:path";
import { Worker } from "node:worker_threads";

import { EventEmitter, Matrix, Point, Serializable } from "../../core";
import { Canvas } from "../canvas";
import { Ray } from "../ray";
import { World } from "../world";
import {
  CalculateColor,
  CameraEvents,
  RenderOptions,
  WorkerMessage,
} from "./types";

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

  private addWorker({
    world,
    image,
    pixelCoordinates,
    workers,
  }: {
    world: World;
    image: Canvas;
    pixelCoordinates: { x: number; y: number }[];
    workers: Set<number>;
  }) {
    const worker = new Worker(path.join(__dirname, "camera-worker.js"), {
      workerData: {
        world: world.serialize(),
        camera: this.serialize(),
      },
    });

    workers.add(worker.threadId);

    worker.on("message", (message: WorkerMessage) => {
      switch (message.action) {
        case "color-calculated": {
          const { x, y, color } = message.payload;

          image.writePixel(x, y, color);
          this.emit("pixel-rendered", x, y, color);
          break;
        }
        case "ready": {
          const coordinates = pixelCoordinates.pop();

          if (coordinates) {
            const message: CalculateColor = {
              action: "calculate-color",
              payload: coordinates,
            };

            worker.postMessage(message);
          } else {
            workers.delete(worker.threadId);

            if (workers.size === 0) {
              this.emit("image-rendered", image);
            }

            worker.terminate();
          }
          break;
        }

        default: {
          throw new TypeError("Unknown message type");
        }
      }
    });
  }

  private static shufflePixels(height: number, width: number) {
    return Array.from({ length: height }, (_, y) =>
      Array.from({ length: width }, (__, x) => ({ x, y })),
    )
      .flat()
      .sort((_a, _b) => 0.5 - Math.random());
  }

  render(world: World, options?: RenderOptions) {
    const image = new Canvas(this.width, this.height);

    if (options?.parallel) {
      const workers = new Set<number>();
      const image = new Canvas(this.width, this.height);
      const pixelCoordinates = Camera.shufflePixels(image.height, image.width);

      for (let i = 0; i < options.workers; i++) {
        this.addWorker({
          workers,
          world,
          image,
          pixelCoordinates,
        });
      }
    } else {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const color = this.colorAt(world, x, y);

          image.writePixel(x, y, color);

          this.emit("pixel-rendered", x, y, color);
        }
      }

      this.emit("image-rendered", image);
    }
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
