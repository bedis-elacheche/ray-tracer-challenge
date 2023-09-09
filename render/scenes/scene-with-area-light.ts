import {
  AreaLight,
  Camera,
  Color,
  Cube,
  Material,
  Plane,
  Point,
  Sphere,
  Transformations,
  Vector,
  World,
} from "../../src";
import { Scene } from "../types";

export const sceneWithAreaLight: Scene = () => {
  const cube = new Cube({
    hasShadow: false,
    material: new Material({
      color: new Color(1.5, 1.5, 1.5),
      ambient: 1,
      diffuse: 0,
      specular: 0,
    }),
    transform: Transformations.translation(0, 3, 4).multiply(
      Transformations.scale(1, 1, 0.01),
    ),
  });

  const plane = new Plane({
    material: new Material({
      color: new Color(1, 1, 1),
      ambient: 0.025,
      diffuse: 0.67,
      specular: 0,
    }),
  });

  const redSphere = new Sphere({
    material: new Material({
      color: new Color(1, 0, 0),
      ambient: 0.1,
      specular: 0,
      diffuse: 0.6,
      reflective: 0.3,
    }),
    transform: Transformations.translation(0.5, 0.5, 0).multiply(
      Transformations.scale(0.5, 0.5, 0.5),
    ),
  });

  const purpleSphere = new Sphere({
    material: new Material({
      color: new Color(0.5, 0.5, 1),
      ambient: 0.1,
      specular: 0,
      diffuse: 0.6,
      reflective: 0.3,
    }),
    transform: Transformations.translation(-0.25, 0.33, 0).multiply(
      Transformations.scale(0.33, 0.33, 0.33),
    ),
  });

  const light = new AreaLight({
    intensity: new Color(1.5, 1.5, 1.5),
    corner: new Point(-1, 2, 4),
    uvec: new Vector(2, 0, 0),
    vvec: new Vector(0, 2, 0),
    usteps: 10,
    vsteps: 10,
    jitter: true,
  });

  const world = new World({
    shapes: [cube, plane, redSphere, purpleSphere],
    lights: [light],
  });

  const camera = new Camera({
    height: 200,
    width: 400,
    fieldOfView: 0.7854,
    transform: Transformations.viewTransform(
      new Point(-4, 1.5, 1),
      new Point(0, -0.5, 0.5),
      new Vector(0, 1, 0),
    ),
  });

  return { camera, world };
};
