import {
  Camera,
  Color,
  Cube,
  Material,
  Matrix,
  Point,
  PointLight,
  TextureMap,
  Transformations,
  UVAlignCheck,
  Vector,
  World,
} from "../../src";
import { Scene } from "../types";

export const sceneWithCheckeredCube: Scene = () => {
  const lights = [
    [0, 100, -100],
    [0, -100, -100],
    [-100, 0, -100],
    [100, 0, -100],
  ].map(
    ([x, y, z]) =>
      new PointLight({
        position: new Point(x, y, z),
        intensity: new Color(0.25, 0.25, 0.25),
      }),
  );

  const createMappedCube = (transform: Matrix) =>
    new Cube({
      transform,
      material: new Material({
        pattern: new TextureMap({
          map: "cubic",
          patterns: {
            left: new UVAlignCheck({
              main: new Color(1, 1, 0),
              ul: new Color(0, 1, 1),
              ur: new Color(1, 0, 0),
              bl: new Color(0, 0, 1),
              br: new Color(1, 0.5, 0),
            }),
            front: new UVAlignCheck({
              main: new Color(0, 1, 1),
              ul: new Color(1, 0, 0),
              ur: new Color(1, 1, 0),
              bl: new Color(1, 0.5, 0),
              br: new Color(0, 1, 0),
            }),
            right: new UVAlignCheck({
              main: new Color(1, 0, 0),
              ul: new Color(1, 1, 0),
              ur: new Color(1, 0, 1),
              bl: new Color(0, 1, 0),
              br: new Color(1, 1, 1),
            }),
            back: new UVAlignCheck({
              main: new Color(0, 1, 0),
              ul: new Color(1, 0, 1),
              ur: new Color(0, 1, 1),
              bl: new Color(1, 1, 1),
              br: new Color(0, 0, 1),
            }),
            up: new UVAlignCheck({
              main: new Color(1, 0.5, 0),
              ul: new Color(0, 1, 1),
              ur: new Color(1, 0, 1),
              bl: new Color(1, 0, 0),
              br: new Color(1, 1, 0),
            }),
            down: new UVAlignCheck({
              main: new Color(1, 0, 1),
              ul: new Color(1, 0.5, 0),
              ur: new Color(0, 1, 0),
              bl: new Color(0, 0, 1),
              br: new Color(1, 1, 1),
            }),
          },
        }),
        ambient: 0.2,
        specular: 0,
        diffuse: 0.8,
      }),
    });

  const cubes = [
    [[-6, 2, 0], 0.7854, 0.7854],
    [[-2, 2, 0], 0.7854, 2.3562],
    [[2, 2, 0], 0.7854, 3.927],
    [[6, 2, 0], 0.7854, 5.4978],
    [[-6, -2, 0], -0.7854, 0.7854],
    [[-2, -2, 0], -0.7854, 2.3562],
    [[2, -2, 0], -0.7854, 3.927],
    [[6, -2, 0], -0.7854, 5.4978],
  ].map(
    ([[x, y, z], rotateX, rotateY]: [
      [number, number, number],
      number,
      number,
    ]) =>
      createMappedCube(
        Transformations.translation(x, y, z)
          .multiply(Transformations.rotateX(rotateX))
          .multiply(Transformations.rotateY(rotateY)),
      ),
  );

  const world = new World({
    lights,
    shapes: cubes,
  });

  const camera = new Camera({
    width: 800,
    height: 800,
    fieldOfView: 0.8,
    transform: Transformations.viewTransform(
      new Point(0, 0, -20),
      new Point(0, 0, 0),
      new Vector(0, 1, 0),
    ),
  });

  return { world, camera };
};
