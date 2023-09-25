import {
  AreaLight,
  CameraProps,
  Color,
  Group,
  Light,
  Material,
  Plane,
  Point,
  PointLight,
  SolidPattern,
  Sphere,
  Transformations,
  Vector,
  World,
} from "ray-tracer";

import { Scene } from "./types";

export const sceneWithBoundingBox: Scene = () => {
  const cube = new Group({
    transform: Transformations.rotateY(Math.PI / 2),
  });

  const [maxX, maxY, maxZ] = [5, 5, 5];

  for (let x = 0; x < maxX; x++) {
    for (let y = 0; y < maxY; y++) {
      for (let z = 0; z < maxZ; z++) {
        const sphere = new Sphere({
          hasShadow: false,
          transform: Transformations.translation(
            x - maxX / 2,
            y - maxY / 2,
            z - maxZ / 2,
          ).multiply(Transformations.scale(0.5, 0.5, 0.5)),
          material: new Material({
            pattern: SolidPattern.from(x / maxX, y / maxY, z / maxZ),
            diffuse: 0.7,
            ambient: 0.1,
            specular: 0,
          }),
        });

        cube.addChildren([sphere]);
      }
    }
  }

  cube.divide(4);

  const lights: Light[] = [
    [-10, 0, 0],
    [10, 0, 0],
    [0, 0, -10],
    [0, 0, 10],
  ].map(
    ([x, y, z]) =>
      new PointLight({
        position: new Point(x, y, z),
        intensity: new Color(0.1, 0.1, 0.1),
      }),
  );

  lights.push(
    new AreaLight({
      vsteps: 5,
      usteps: 5,
      corner: new Point(0, 10, 0),
      vvec: new Vector(0, 1, 0),
      uvec: new Vector(1, 0, 0),
      intensity: new Color(0.75, 0.75, 0.75),
    }),
  );

  const plane = new Plane({
    material: new Material({
      pattern: SolidPattern.from(1, 1, 1),
      ambient: 0.025,
      diffuse: 0.67,
      specular: 0,
    }),
    transform: Transformations.translation(0, -5.01, 0).multiply(
      Transformations.scale(15, 15, 15),
    ),
  });

  const world = new World({
    shapes: [cube, plane],
    lights,
  });

  const cameraProps: CameraProps = {
    height: 500,
    width: 500,
    fieldOfView: Math.PI / 3,
    transform: Transformations.viewTransform(
      new Point(5, 5, -5),
      new Point(0, 0, 0),
      new Vector(0, 1, 0),
    ),
  };

  return { cameraProps, world };
};
