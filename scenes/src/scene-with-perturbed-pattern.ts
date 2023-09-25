import {
  BlendedPattern,
  CameraProps,
  Color,
  Cube,
  GradientPattern,
  Material,
  OctavePerlinNoise,
  PerlinNoise,
  PerturbedPattern,
  Plane,
  Point,
  PointLight,
  SolidPattern,
  Sphere,
  StripesPattern,
  TextureMapPattern,
  Transformations,
  UVCheckersPattern,
  Vector,
  World,
} from "ray-tracer";

import { Scene } from "./types";

export const sceneWithPerturbedPattern: Scene = () => {
  const floor = new Plane({
    transform: Transformations.scale(10, 1, 10),
    material: new Material({
      pattern: new PerturbedPattern({
        noise: new PerlinNoise(),
        pattern: new BlendedPattern({
          transform: Transformations.rotateY(Math.PI / 4).multiply(
            Transformations.scale(0.15, 0.15, 0.15),
          ),
          patterns: [
            new StripesPattern({
              patterns: [
                SolidPattern.from(116 / 255, 185 / 255, 255 / 255),
                SolidPattern.from(99 / 255, 110 / 255, 114 / 255),
              ],
            }),
            new StripesPattern({
              transform: Transformations.rotateY(Math.PI / 2),
              patterns: [
                SolidPattern.from(116 / 255, 185 / 255, 255 / 255),
                SolidPattern.from(99 / 255, 110 / 255, 114 / 255),
              ],
            }),
          ],
        }),
      }),
      specular: 0,
      diffuse: 1,
      reflective: 0.3,
    }),
  });

  const sphere = new Sphere({
    transform: Transformations.translation(0, 1, 0)
      .multiply(Transformations.rotateX(Math.PI / 4))
      .multiply(Transformations.rotateZ(Math.PI / 6)),
    material: new Material({
      pattern: new PerturbedPattern({
        noise: new OctavePerlinNoise({
          octaves: 4,
          persistence: 5,
        }),
        pattern: new TextureMapPattern({
          map: "spherical",
          patterns: {
            main: new UVCheckersPattern({
              width: 10,
              height: 10,
              patterns: [
                SolidPattern.from(1, 0, 0),
                SolidPattern.from(0.5, 0.5, 1),
              ],
            }),
          },
        }),
      }),
      ambient: 0.1,
      specular: 0,
      diffuse: 0.6,
      reflective: 0.3,
    }),
  });

  const cone = new Cube({
    transform: Transformations.translation(-2, 0.5, -1).multiply(
      Transformations.scale(0.5, 0.5, 0.5),
    ),
    material: new Material({
      pattern: new PerturbedPattern({
        noise: new PerlinNoise(),
        scale: 0.75,
        pattern: new GradientPattern({
          patterns: [SolidPattern.from(1, 1, 0), SolidPattern.from(0, 1, 1)],
        }),
      }),
      ambient: 0.1,
      specular: 0,
      diffuse: 0.6,
      reflective: 0.3,
    }),
  });

  const light = new PointLight({
    position: new Point(-10, 10, -10),
    intensity: new Color(1, 1, 1),
  });

  const world = new World({
    shapes: [floor, sphere, cone],
    lights: [light],
  });

  const cameraProps: CameraProps = {
    height: 800,
    width: 800,
    fieldOfView: Math.PI / 3,
    transform: Transformations.viewTransform(
      new Point(0, 4, -5),
      new Point(0, 0, 0),
      new Vector(0, 1, 0),
    ),
  };

  return { cameraProps, world };
};
