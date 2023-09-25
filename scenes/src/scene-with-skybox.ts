import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  CameraProps,
  Canvas,
  Color,
  Cube,
  Material,
  Point,
  PointLight,
  Sphere,
  TextureMapPattern,
  Transformations,
  UVImagePattern,
  Vector,
  World,
} from "ray-tracer";

import { Scene } from "./types";

export const sceneWithSkybox: Scene = () => {
  const cameraProps: CameraProps = {
    width: 800,
    height: 800,
    fieldOfView: 1.2,
    transform: Transformations.viewTransform(
      new Point(0, 0, 0),
      new Point(0, 0, 5),
      new Vector(0, 1, 0),
    ),
  };

  const light = new PointLight({
    position: new Point(0, 100, 0),
    intensity: new Color(1, 1, 1),
  });

  const sphere = new Sphere({
    transform: Transformations.translation(0, 0, 5).multiply(
      Transformations.scale(0.75, 0.75, 0.75),
    ),
    material: new Material({
      diffuse: 0.4,
      specular: 0.6,
      shininess: 20,
      reflective: 0.6,
      ambient: 0,
    }),
  });

  const [negx, posx, posz, negz, posy, negy] = [
    "negx",
    "posx",
    "posz",
    "negz",
    "posy",
    "negy",
  ].map((item) =>
    readFileSync(
      join(__dirname, "ppm", "LancellottiChapel", `${item}.ppm`),
      "utf-8",
    ),
  );

  const skybox = new Cube({
    transform: Transformations.scale(1000, 1000, 1000),
    material: new Material({
      pattern: new TextureMapPattern({
        map: "cubic",
        patterns: {
          left: new UVImagePattern({ canvas: Canvas.from(negx) }),
          right: new UVImagePattern({ canvas: Canvas.from(posx) }),
          front: new UVImagePattern({ canvas: Canvas.from(posz) }),
          back: new UVImagePattern({ canvas: Canvas.from(negz) }),
          up: new UVImagePattern({ canvas: Canvas.from(posy) }),
          down: new UVImagePattern({ canvas: Canvas.from(negy) }),
        },
      }),
      diffuse: 0,
      specular: 0,
      ambient: 1,
    }),
  });

  const world = new World({
    lights: [light],
    shapes: [sphere, skybox],
  });

  return { cameraProps, world };
};
