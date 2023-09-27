import {
  CalculateColor,
  Camera as RTCamera,
  CameraProps,
  Canvas,
  InitWorker,
  RenderOptions,
  WorkerMessage,
  World,
} from "ray-tracer";

export class Camera extends RTCamera {
  workers: Set<Worker>;

  constructor({ height, width, transform, fieldOfView }: CameraProps) {
    super({ height, width, transform, fieldOfView });

    this.workers = new Set<Worker>();
  }

  private addWorker({
    world,
    image,
    pixelCoordinates,
  }: {
    world: World;
    image: Canvas;
    pixelCoordinates: { x: number; y: number }[];
  }) {
    const worker = new Worker("./camera-worker.ts");

    this.workers.add(worker);

    worker.addEventListener("message", (event: MessageEvent<WorkerMessage>) => {
      switch (event.data.action) {
        case "online": {
          const message: InitWorker = {
            action: "init",
            payload: {
              world: world.serialize(),
              camera: this.serialize(),
            },
          };
          worker.postMessage(message);
          break;
        }
        case "color-calculated": {
          const { x, y, color } = event.data.payload;

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
            this.workers.delete(worker);

            if (this.workers.size === 0) {
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
      this.workers.clear();

      const image = new Canvas({ width: this.width, height: this.height });
      const pixelCoordinates = RTCamera.shufflePixels(
        image.height,
        image.width,
      );

      for (let i = 0; i < options.workers; i++) {
        this.addWorker({
          world,
          image,
          pixelCoordinates,
        });
      }
    } else {
      super.render(world);
    }
  }

  abort() {
    this.workers.forEach((worker) => {
      worker.terminate();
    });

    this.workers.clear();
  }
}
