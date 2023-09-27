import {
  Camera,
  ColorCalculated,
  MainThreadMessage,
  Online,
  Ready,
  World,
} from "ray-tracer";

const READY: Ready = { action: "ready", payload: {} };
const ONLINE: Online = { action: "online", payload: {} };

let world: World;
let camera: Camera;

self.onmessage = (event: MessageEvent<MainThreadMessage>) => {
  switch (event.data.action) {
    case "init": {
      world = World.deserialize(event.data.payload.world);
      camera = Camera.deserialize(event.data.payload.camera);
      self.postMessage(READY);
      break;
    }
    case "calculate-color": {
      const { x, y } = event.data.payload;
      const color = camera.colorAt(world, x, y);
      const result: ColorCalculated = {
        action: "color-calculated",
        payload: {
          x,
          y,
          color,
        },
      };
      self.postMessage(result);
      self.postMessage(READY);
      break;
    }
    default: {
      throw new TypeError("Unknown message type");
    }
  }
};

self.postMessage(ONLINE);

export {};
