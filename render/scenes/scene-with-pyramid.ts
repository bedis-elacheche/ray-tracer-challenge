import {
  Camera,
  Color,
  Group,
  Light,
  Material,
  Plane,
  Point,
  Transformations,
  Triangle,
  Vector,
  World,
} from "../../src";

export const sceneWithPyramid = () => {
  const floor = new Plane({
    transform: Transformations.scale(10, 0.01, 10),
    material: new Material({
      color: new Color(1, 0.9, 0.9),
      specular: 0,
    }),
  });

  const leftWall = new Plane({
    transform: Transformations.translation(0, 0, 5)
      .multiply(Transformations.rotateY(-Math.PI / 4))
      .multiply(Transformations.rotateX(Math.PI / 2))
      .multiply(Transformations.scale(10, 0.01, 10)),
    material: floor.material,
  });

  const rightWall = new Plane({
    transform: Transformations.translation(0, 0, 5)
      .multiply(Transformations.rotateY(Math.PI / 4))
      .multiply(Transformations.rotateX(Math.PI / 2))
      .multiply(Transformations.scale(10, 0.01, 10)),
    material: floor.material,
  });

  const points = [
    new Point(-1, 0, -1),
    new Point(1, 0, -1),
    new Point(1, 0, 1),
    new Point(-1, 0, 1),
    new Point(0, 2, 0),
  ];

  const pyramid = new Group({
    children: [
      new Triangle({ p1: points[0], p2: points[1], p3: points[4] }),
      new Triangle({ p1: points[1], p2: points[2], p3: points[4] }),
      new Triangle({ p1: points[2], p2: points[3], p3: points[4] }),
      new Triangle({ p1: points[3], p2: points[0], p3: points[4] }),
    ],
    transform: Transformations.translation(-0.5, 0, -0.5)
      .multiply(Transformations.rotateY(Math.PI / 5))
      .multiply(Transformations.scale(1.25, 1, 1.25)),
  });

  pyramid.applyMaterial(
    new Material({
      color: new Color(0, 0.75, 0.75),
      specular: 0.9,
      diffuse: 0.9,
    }),
  );

  const light = new Light(new Point(-10, 10, -10), new Color(1, 1, 1));

  const world = new World({
    shapes: [floor, leftWall, rightWall, pyramid],
    lights: [light],
  });

  const camera = new Camera(
    800,
    800,
    Math.PI / 3,
    Transformations.viewTransform(
      new Point(0, 3, -7),
      new Point(0, 1, 0),
      new Vector(0, 1, 0),
    ),
  );

  return camera.render(world);
};
