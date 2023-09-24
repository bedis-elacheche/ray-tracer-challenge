import {
  Camera,
  Color,
  Material,
  Point,
  PointLight,
  SolidPattern,
  Sphere,
  Transformations,
  Vector,
  World,
} from "../../src";
import { Scene } from "../types";

export const scene: Scene = () => {
  const floor = new Sphere({
    transform: Transformations.scale(10, 0.01, 10),
    material: new Material({
      pattern: SolidPattern.from(1, 0.9, 0.9),
      specular: 0,
    }),
  });

  const leftWall = new Sphere({
    transform: Transformations.translation(0, 0, 5)
      .multiply(Transformations.rotateY(-Math.PI / 4))
      .multiply(Transformations.rotateX(Math.PI / 2))
      .multiply(Transformations.scale(10, 0.01, 10)),
    material: floor.material,
  });

  const rightWall = new Sphere({
    transform: Transformations.translation(0, 0, 5)
      .multiply(Transformations.rotateY(Math.PI / 4))
      .multiply(Transformations.rotateX(Math.PI / 2))
      .multiply(Transformations.scale(10, 0.01, 10)),
    material: floor.material,
  });

  const middle = new Sphere({
    transform: Transformations.translation(-0.5, 1, 0.5),
    material: new Material({
      pattern: SolidPattern.from(0.1, 1, 0.5),
      diffuse: 0.7,
      specular: 0.3,
    }),
  });

  const right = new Sphere({
    transform: Transformations.translation(1.5, 0.5, -0.5).multiply(
      Transformations.scale(0.5, 0.5, 0.5),
    ),
    material: new Material({
      pattern: SolidPattern.from(0.5, 1, 0.1),
      diffuse: 0.7,
      specular: 0.3,
    }),
  });

  const left = new Sphere({
    transform: Transformations.translation(-1.5, 0.33, -0.75).multiply(
      Transformations.scale(0.33, 0.33, 0.33),
    ),
    material: new Material({
      pattern: SolidPattern.from(1, 0.8, 0.1),
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

  const camera = new Camera({
    height: 800,
    width: 800,
    fieldOfView: Math.PI / 3,
    transform: Transformations.viewTransform(
      new Point(0, 1.5, -5),
      new Point(0, 1, 0),
      new Vector(0, 1, 0),
    ),
  });

  return { camera, world };
};
