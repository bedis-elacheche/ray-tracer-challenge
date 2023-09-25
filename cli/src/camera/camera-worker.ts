import { parentPort, workerData } from "node:worker_threads";

import {
  Camera,
  ColorCalculated,
  MainThreadMessage,
  Ready,
  World,
} from "ray-tracer";

const world = World.deserialize(workerData.world);
const camera = Camera.deserialize(workerData.camera);

const READY: Ready = { action: "ready", payload: {} };

parentPort.on("message", (message: MainThreadMessage) => {
  switch (message.action) {
    case "calculate-color": {
      const { x, y } = message.payload;
      const color = camera.colorAt(world, x, y);
      const result: ColorCalculated = {
        action: "color-calculated",
        payload: {
          x,
          y,
          color,
        },
      };
      parentPort.postMessage(result);
      parentPort.postMessage(READY);
      break;
    }
    default: {
      throw new TypeError("Unknown message type");
    }
  }
});

parentPort.postMessage(READY);
