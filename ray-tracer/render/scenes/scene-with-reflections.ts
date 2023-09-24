import {
  Camera,
  CheckersPattern,
  Color,
  Material,
  Plane,
  Point,
  PointLight,
  SolidPattern,
  Sphere,
  Transformations,
  Vector,
  World,
} from "../../src";
import { Scene } from "../types";

export const sceneWithReflections: Scene = () => {
  const floor = new Plane({
    transform: Transformations.scale(10, 0.01, 10),
    material: new Material({
      pattern: new CheckersPattern({
        patterns: [
          SolidPattern.from(0.25, 0.25, 0.22),
          SolidPattern.from(0.5, 0.5, 0.5),
        ],
        transform: Transformations.scale(0.25, 0.25, 0.25),
      }),
      specular: 0.5,
      reflective: 0.25,
    }),
  });

  const wallMaterial = new Material({
    pattern: SolidPattern.from(0.8, 0.8, 0.8),
    specular: 0.5,
    diffuse: 0.5,
  });

  const leftWall = new Plane({
    transform: Transformations.translation(0, 0, 5)
      .multiply(Transformations.rotateY(-Math.PI / 4))
      .multiply(Transformations.rotateX(Math.PI / 2))
      .multiply(Transformations.scale(10, 0.01, 10)),
    material: wallMaterial,
  });

  const rightWall = new Plane({
    transform: Transformations.translation(0, 0, 5)
      .multiply(Transformations.rotateY(Math.PI / 4))
      .multiply(Transformations.rotateX(Math.PI / 2))
      .multiply(Transformations.scale(10, 0.01, 10)),
    material: wallMaterial,
  });

  const outer = new Sphere({
    transform: Transformations.translation(-0.5, 1, 0.5),
    material: new Material({
      pattern: SolidPattern.from(0, 0, 0),
      diffuse: 0.7,
      specular: 1,
      shininess: 250,
      transparency: 0.9,
      reflective: 1,
    }),
  });

  const inner = new Sphere({
    transform: Transformations.translation(-0.5, 1, 0.5).multiply(
      Transformations.scale(0.5, 0.5, 0.5),
    ),
    material: new Material({
      pattern: SolidPattern.from(0.25, 0, 0),
      diffuse: 0.7,
      specular: 1,
      shininess: 250,
      transparency: 0.9,
      reflective: 1,
    }),
  });

  const light = new PointLight({
    position: new Point(-10, 10, -10),
    intensity: new Color(1, 1, 1),
  });

  const world = new World({
    shapes: [floor, leftWall, rightWall, outer, inner],
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
