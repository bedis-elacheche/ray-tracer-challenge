import {
  Camera,
  CheckersPattern,
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
} from "../../src";
import { Scene } from "../types";

export const sceneWithComposedPattern: Scene = () => {
  const floor = new Plane({
    transform: Transformations.scale(10, 1, 10),
    material: new Material({
      pattern: new CheckersPattern({
        transform: Transformations.scale(0.15, 0.15, 0.15),
        patterns: [
          new StripesPattern({
            transform: Transformations.rotateY(Math.PI / 4).multiply(
              Transformations.scale(0.2, 1, 1),
            ),

            patterns: [
              SolidPattern.from(99 / 255, 110 / 255, 114 / 255),
              SolidPattern.from(178 / 255, 190 / 255, 195 / 255),
            ],
          }),
          new StripesPattern({
            transform: Transformations.rotateY(Math.PI / 4).multiply(
              Transformations.scale(0.2, 1, 1),
            ),
            patterns: [
              SolidPattern.from(116 / 255, 185 / 255, 255 / 255),
              SolidPattern.from(9 / 255, 132 / 255, 227 / 255),
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

  const camera = new Camera({
    height: 800,
    width: 800,
    fieldOfView: Math.PI / 3,
    transform: Transformations.viewTransform(
      new Point(0, 4, -5),
      new Point(0, 0, 0),
      new Vector(0, 1, 0),
    ),
  });

  return { camera, world };
};
