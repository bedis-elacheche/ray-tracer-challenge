import { CameraProps, World } from "ray-tracer";

import { Camera } from "./camera";
import { Progress } from "./progress";

export const renderScene = (cameraProps: CameraProps, world: World) => {
  const camera = new Camera(cameraProps);
  const progress = new Progress();
  const abort = document.getElementById("abort") as HTMLButtonElement;
  const canvas = document.getElementById("render-result") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");

  const abortRender = () => {
    camera.abort();
    progress.stop();
  };

  abort.addEventListener("click", abortRender);

  camera.on("pixel-rendered", (x, y, color) => {
    if (ctx) {
      ctx.fillStyle = `rgb(${color.red * 255}, ${color.green * 255}, ${
        color.blue * 255
      })`;
      ctx.fillRect(x, y, 1, 1);
    }

    progress.increment(1);
  });

  camera.on("image-rendered", () => {
    progress.stop();
    abort.removeEventListener("click", abortRender);
  });

  progress.start(cameraProps.width * cameraProps.height);

  camera.render(world, {
    parallel: true,
    workers: navigator.hardwareConcurrency,
  });
};
