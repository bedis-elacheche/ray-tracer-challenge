import {
  Camera,
  Color,
  Cylinder,
  Material,
  Point,
  PointLight,
  TextureMap,
  Transformations,
  UVCheckers,
  UVMap,
  Vector,
  World,
} from "../../src";
import { Scene } from "../types";

export const sceneWithCheckeredCylinder: Scene = () => {
  const cylinder = new Cylinder({
    minimum: 0,
    maximum: 1,
    transform: Transformations.scale(1, 3.1415, 1).multiply(
      Transformations.translation(0, -0.5, 0),
    ),
    material: new Material({
      pattern: new TextureMap({
        uvMapper: UVMap.cylindrical,
        pattern: new UVCheckers({
          width: 16,
          height: 8,
          colors: [new Color(0, 0.5, 0), new Color(1, 1, 1)],
        }),
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
    shapes: [cylinder],
    lights: [light],
  });

  const camera = new Camera({
    height: 400,
    width: 400,
    fieldOfView: 0.5,
    transform: Transformations.viewTransform(
      new Point(0, 0, -10),
      new Point(0, 0, 0),
      new Vector(0, 1, 0),
    ),
  });

  return { camera, world };
};
