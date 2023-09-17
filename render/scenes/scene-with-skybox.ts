import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  Camera,
  Canvas,
  Color,
  Cube,
  Material,
  Point,
  PointLight,
  Sphere,
  TextureMap,
  Transformations,
  UVImage,
  Vector,
  World,
} from "../../src";
import { Scene } from "../types";

export const sceneWithSkybox: Scene = () => {
  const camera = new Camera({
    width: 800,
    height: 800,
    fieldOfView: 1.2,
    transform: Transformations.viewTransform(
      new Point(0, 0, 0),
      new Point(0, 0, 5),
      new Vector(0, 1, 0),
    ),
  });

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
      pattern: new TextureMap({
        map: "cubic",
        patterns: {
          left: new UVImage({ canvas: Canvas.from(negx) }),
          right: new UVImage({ canvas: Canvas.from(posx) }),
          front: new UVImage({ canvas: Canvas.from(posz) }),
          back: new UVImage({ canvas: Canvas.from(negz) }),
          up: new UVImage({ canvas: Canvas.from(posy) }),
          down: new UVImage({ canvas: Canvas.from(negy) }),
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

  return { camera, world };
};
