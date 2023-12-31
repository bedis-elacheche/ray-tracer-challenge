import {
  CameraProps,
  Color,
  Cylinder,
  Group,
  Material,
  Matrix,
  Point,
  PointLight,
  SolidPattern,
  Sphere,
  Transformations,
  Vector,
  World,
} from "ray-tracer";

import { Scene } from "./types";

const makeHexagonCorner = () => {
  return new Sphere({
    transform: Transformations.translation(0, 0, -1).multiply(
      Transformations.scale(0.25, 0.25, 0.25),
    ),
  });
};

const makeHexagonEdge = () => {
  return new Cylinder({
    minimum: 0,
    maximum: 1,
    transform: Transformations.translation(0, 0, -1)
      .multiply(Transformations.rotateY(-Math.PI / 6))
      .multiply(Transformations.rotateZ(-Math.PI / 2))
      .multiply(Transformations.scale(0.25, 1, 0.25)),
  });
};

const makeHexagonSide = ({ transform }: { transform?: Matrix }) => {
  return new Group({
    transform,
    children: [makeHexagonCorner(), makeHexagonEdge()],
  });
};

export const hexagon: Scene = () => {
  const hexagon = new Group({
    transform: Transformations.rotateY(Math.PI / 4),
    children: Array.from({ length: 6 }, (_, i) =>
      makeHexagonSide({
        transform: Transformations.rotateY((i * Math.PI) / 3),
      }),
    ),
  });

  hexagon.applyMaterial(
    new Material({
      pattern: SolidPattern.from(1, 0.5, 0.38),
    }),
  );

  const light = new PointLight({
    position: new Point(-10, 10, -10),
    intensity: new Color(1, 1, 1),
  });

  const world = new World({
    shapes: [hexagon],
    lights: [light],
  });

  const cameraProps: CameraProps = {
    height: 800,
    width: 800,
    fieldOfView: Math.PI / 3,
    transform: Transformations.viewTransform(
      new Point(0, 1.5, -3),
      new Point(0, 0, 0),
      new Vector(0, 1, 0),
    ),
  };

  return { cameraProps, world };
};
