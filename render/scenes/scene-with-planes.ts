import {
  Camera,
  Color,
  Light,
  Material,
  Plane,
  Point,
  Sphere,
  Transformations,
  Vector,
  World,
} from "../../src";

export const sceneWithPlanes = () => {
  const floor = new Plane(
    undefined,
    Transformations.scale(10, 0.01, 10),
    new Material({
      color: new Color(1, 0.9, 0.9),
      specular: 0,
    }),
  );

  const middle = new Sphere(
    undefined,
    Transformations.translation(-0.5, 1, 0.5),
    new Material({
      color: new Color(0.1, 1, 0.5),
      diffuse: 0.7,
      specular: 0.3,
    }),
  );

  const right = new Sphere(
    undefined,
    Transformations.translation(1.5, 0.5, -0.5).multiply(
      Transformations.scale(0.5, 0.5, 0.5),
    ),
    new Material({
      color: new Color(0.5, 1, 0.1),
      diffuse: 0.7,
      specular: 0.3,
    }),
  );

  const left = new Sphere(
    undefined,
    Transformations.translation(-1.5, 0.33, -0.75).multiply(
      Transformations.scale(0.33, 0.33, 0.33),
    ),
    new Material({
      color: new Color(1, 0.8, 0.1),
      diffuse: 0.7,
      specular: 0.3,
    }),
  );

  const light = new Light(new Point(-10, 10, -10), new Color(1, 1, 1));

  const world = new World({ shapes: [floor, middle, left, right], light });

  const camera = new Camera(
    300,
    300,
    Math.PI / 3,
    Transformations.viewTransform(
      new Point(0, 1.5, -5),
      new Point(0, 1, 0),
      new Vector(0, 1, 0),
    ),
  );

  return camera.render(world);
};
