import {
  Camera,
  Color,
  Material,
  Point,
  PointLight,
  SolidPattern,
  Sphere,
  TextureMapPattern,
  Transformations,
  UVCheckersPattern,
  Vector,
  World,
} from "ray-tracer";

import { Scene } from "./types";

export const sceneWithCheckeredSphere: Scene = () => {
  const sphere = new Sphere({
    material: new Material({
      pattern: new TextureMapPattern({
        map: "spherical",
        patterns: {
          main: new UVCheckersPattern({
            width: 20,
            height: 10,
            patterns: [
              SolidPattern.from(0, 0.5, 0),
              SolidPattern.from(1, 1, 1),
            ],
          }),
        },
      }),
      ambient: 0.1,
      specular: 0.4,
      shininess: 10,
      diffuse: 0.6,
    }),
  });

  const light = new PointLight({
    position: new Point(-10, 10, -10),
    intensity: new Color(1, 1, 1),
  });

  const world = new World({
    shapes: [sphere],
    lights: [light],
  });

  const camera = new Camera({
    height: 400,
    width: 400,
    fieldOfView: 0.5,
    transform: Transformations.viewTransform(
      new Point(0, 0, -5),
      new Point(0, 0, 0),
      new Vector(0, 1, 0),
    ),
  });

  return { camera, world };
};
