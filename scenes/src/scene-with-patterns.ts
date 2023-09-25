import {
  CameraProps,
  CheckersPattern,
  Color,
  GradientPattern,
  Material,
  Point,
  PointLight,
  RingPattern,
  SolidPattern,
  Sphere,
  StripesPattern,
  Transformations,
  Vector,
  World,
} from "ray-tracer";

import { Scene } from "./types";

export const sceneWithPatterns: Scene = () => {
  const floor = new Sphere({
    transform: Transformations.scale(10, 0.01, 10),
    material: new Material({
      pattern: new CheckersPattern({
        patterns: [SolidPattern.from(1, 0, 0.2), SolidPattern.from(1, 1, 1)],
        transform: Transformations.scale(0.25, 0.25, 0.25),
      }),
      specular: 0,
    }),
  });

  const wallMaterial = new Material({
    pattern: new StripesPattern({
      patterns: [SolidPattern.from(1, 0, 0.2), SolidPattern.from(1, 1, 1)],
      transform: Transformations.scale(0.05, 1, 1),
    }),
    specular: 0,
  });

  const leftWall = new Sphere({
    transform: Transformations.translation(0, 0, 5)
      .multiply(Transformations.rotateY(-Math.PI / 4))
      .multiply(Transformations.rotateX(Math.PI / 2))
      .multiply(Transformations.scale(10, 0.01, 10)),
    material: wallMaterial,
  });

  const rightWall = new Sphere({
    transform: Transformations.translation(0, 0, 5)
      .multiply(Transformations.rotateY(Math.PI / 4))
      .multiply(Transformations.rotateX(Math.PI / 2))
      .multiply(Transformations.scale(10, 0.01, 10)),
    material: wallMaterial,
  });

  const middle = new Sphere({
    transform: Transformations.translation(-0.5, 1, 0.5),
    material: new Material({
      pattern: new StripesPattern({
        patterns: [SolidPattern.from(0.2, 0, 1), SolidPattern.from(1, 1, 1)],
        transform: Transformations.rotateZ(Math.PI / 2).multiply(
          Transformations.scale(0.15, 1, 1),
        ),
      }),
      diffuse: 0.7,
      specular: 0.3,
    }),
  });

  const right = new Sphere({
    transform: Transformations.translation(1.5, 0.5, -0.5).multiply(
      Transformations.scale(0.5, 0.5, 0.5),
    ),
    material: new Material({
      pattern: new GradientPattern({
        patterns: [SolidPattern.from(1, 0, 1), SolidPattern.from(1, 1, 1)],
      }),
      diffuse: 0.7,
      specular: 0.3,
    }),
  });

  const left = new Sphere({
    transform: Transformations.translation(-1.5, 0.33, -0.75).multiply(
      Transformations.scale(0.33, 0.33, 0.33),
    ),
    material: new Material({
      pattern: new RingPattern({
        patterns: [SolidPattern.from(0, 1, 1), SolidPattern.from(0, 0, 0)],
        transform: Transformations.scale(0.25, 1, 0.25),
      }),
      diffuse: 0.7,
      specular: 0.3,
    }),
  });

  const light = new PointLight({
    position: new Point(-10, 10, -10),
    intensity: new Color(1, 1, 1),
  });

  const world = new World({
    shapes: [floor, leftWall, rightWall, middle, left, right],
    lights: [light],
  });

  const cameraProps: CameraProps = {
    height: 800,
    width: 800,
    fieldOfView: Math.PI / 3,
    transform: Transformations.viewTransform(
      new Point(0, 1.5, -5),
      new Point(0, 1, 0),
      new Vector(0, 1, 0),
    ),
  };

  return { cameraProps, world };
};
