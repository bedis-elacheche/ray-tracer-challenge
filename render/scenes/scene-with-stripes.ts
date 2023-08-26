import {
  Camera,
  Color,
  Light,
  Material,
  Point,
  Sphere,
  Stripe,
  Transformations,
  Vector,
  World,
} from "../../src";

export const sceneWithStripes = () => {
  const pattern = new Stripe(
    new Color(1, 0, 0.2),
    new Color(1, 1, 1),
    Transformations.scale(0.05, 1, 1),
  );
  const floor = new Sphere(
    undefined,
    Transformations.scale(10, 0.01, 10),
    new Material({
      pattern,
      specular: 0,
    }),
  );

  const leftWall = new Sphere(
    undefined,
    Transformations.translation(0, 0, 5)
      .multiply(Transformations.rotateY(-Math.PI / 4))
      .multiply(Transformations.rotateX(Math.PI / 2))
      .multiply(Transformations.scale(10, 0.01, 10)),
    floor.material,
  );

  const rightWall = new Sphere(
    undefined,
    Transformations.translation(0, 0, 5)
      .multiply(Transformations.rotateY(Math.PI / 4))
      .multiply(Transformations.rotateX(Math.PI / 2))
      .multiply(Transformations.scale(10, 0.01, 10)),
    floor.material,
  );

  const spherePattern = new Stripe(
    new Color(0.2, 0, 1),
    new Color(1, 1, 1),
    Transformations.rotateZ(Math.PI / 2).multiply(
      Transformations.scale(0.15, 1, 1),
    ),
  );

  const middle = new Sphere(
    undefined,
    Transformations.translation(-0.5, 1, 0.5),
    new Material({
      pattern: spherePattern,
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
      pattern: spherePattern,
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
      pattern: spherePattern,
      diffuse: 0.7,
      specular: 0.3,
    }),
  );

  const light = new Light(new Point(-10, 10, -10), new Color(1, 1, 1));

  const world = new World({
    shapes: [floor, leftWall, rightWall, middle, left, right],
    light,
  });

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
