import path from "node:path";
import { Worker } from "node:worker_threads";

import {
  CalculateColor,
  Camera as RTCamera,
  Canvas,
  RenderOptions,
  WorkerMessage,
  World,
} from "ray-tracer";

export class Camera extends RTCamera {
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

  render(world: World, options?: RenderOptions) {
    if (options?.parallel) {
      const workers = new Set<number>();
      const image = new Canvas({ width: this.width, height: this.height });
      const pixelCoordinates = RTCamera.shufflePixels(
        image.height,
        image.width,
      );

      for (let i = 0; i < options.workers; i++) {
        this.addWorker({
          workers,
          world,
          image,
          pixelCoordinates,
        });
      }
    } else {
      super.render(world);
    }
  }
}
