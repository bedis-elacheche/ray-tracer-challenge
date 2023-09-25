import {
  BlendedPattern,
  CameraProps,
  Color,
  Material,
  Plane,
  Point,
  PointLight,
  SolidPattern,
  StripesPattern,
  Transformations,
  Vector,
  World,
} from "ray-tracer";

import { Scene } from "./types";

export const sceneWithBlendedPattern: Scene = () => {
  const floor = new Plane({
    transform: Transformations.scale(10, 1, 10),
    material: new Material({
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
      specular: 0,
      diffuse: 1,
    }),
  });

  const light = new PointLight({
    position: new Point(-10, 10, -10),
    intensity: new Color(1, 1, 1),
  });

  const world = new World({
    shapes: [floor],
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
