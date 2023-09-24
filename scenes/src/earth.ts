import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  Camera,
  Canvas,
  Color,
  Cylinder,
  Material,
  Plane,
  Point,
  PointLight,
  SolidPattern,
  Sphere,
  TextureMapPattern,
  Transformations,
  UVImagePattern,
  Vector,
  World,
} from "ray-tracer";

import { Scene } from "./types";

export const sceneWithMappedEarth: Scene = () => {
  const camera = new Camera({
    width: 800,
    height: 800,
    fieldOfView: 0.8,
    transform: Transformations.viewTransform(
      new Point(1, 2, -10),
      new Point(0, 1.1, 0),
      new Vector(0, 1, 0),
    ),
  });

  const light = new PointLight({
    position: new Point(-100, 100, -100),
    intensity: new Color(1, 1, 1),
  });

  const plane = new Plane({
    material: new Material({
      pattern: SolidPattern.White(),
      diffuse: 0.1,
      specular: 0,
      ambient: 0,
      reflective: 0.4,
    }),
  });

  const cylinder = new Cylinder({
    minimum: 0,
    maximum: 0.1,
    closed: true,
    material: new Material({
      pattern: SolidPattern.White(),
      diffuse: 0.2,
      specular: 0,
      ambient: 0,
      reflective: 0.4,
    }),
  });

  const ppm = readFileSync(join(__dirname, "ppm", "earthmap1k.ppm"), "utf-8");

  const canvas = Canvas.from(ppm);

  const sphere = new Sphere({
    transform: Transformations.translation(0, 1.1, 0)
      .multiply(Transformations.rotateY(3.5))
      .multiply(Transformations.rotateX(0.5))
      .multiply(Transformations.rotateZ(-0.1)),
    material: new Material({
      pattern: new TextureMapPattern({
        patterns: {
          main: new UVImagePattern({ canvas }),
        },
        map: "spherical",
      }),
      diffuse: 0.9,
      specular: 0.1,
      shininess: 10,
      ambient: 0.1,
    }),
  });

  const world = new World({
    lights: [light],
    shapes: [plane, cylinder, sphere],
  });

  return { camera, world };
};
