import {
  Camera,
  Color,
  Light,
  Material,
  Point,
  Sphere,
  Stripes,
  Transformations,
  Vector,
  World,
} from "../../src";
import { ProgressBar } from "../progress";

export const sceneWithStripes = (name: string, progress: ProgressBar) => {
  const pattern = new Stripes({
    colors: [new Color(1, 0, 0.2), new Color(1, 1, 1)],
    transform: Transformations.scale(0.05, 1, 1),
  });
  const floor = new Sphere({
    transform: Transformations.scale(10, 0.01, 10),
    material: new Material({
      pattern,
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

  const spherePattern = new Stripes({
    colors: [new Color(0.2, 0, 1), new Color(1, 1, 1)],
    transform: Transformations.rotateZ(Math.PI / 2).multiply(
      Transformations.scale(0.15, 1, 1),
    ),
  });

  const middle = new Sphere({
    transform: Transformations.translation(-0.5, 1, 0.5),
    material: new Material({
      pattern: spherePattern,
      diffuse: 0.7,
      specular: 0.3,
    }),
  });

  const right = new Sphere({
    transform: Transformations.translation(1.5, 0.5, -0.5).multiply(
      Transformations.scale(0.5, 0.5, 0.5),
    ),
    material: new Material({
      pattern: spherePattern,
      diffuse: 0.7,
      specular: 0.3,
    }),
  });

  const left = new Sphere({
    transform: Transformations.translation(-1.5, 0.33, -0.75).multiply(
      Transformations.scale(0.33, 0.33, 0.33),
    ),
    material: new Material({
      pattern: spherePattern,
      diffuse: 0.7,
      specular: 0.3,
    }),
  });

  const light = new Light(new Point(-10, 10, -10), new Color(1, 1, 1));

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

  progress.start(name, camera.height * camera.width);

  camera.on("pixel-rendered", () => {
    progress.increment("current");
  });

  return camera.render(world);
};
