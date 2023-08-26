import {
  Camera,
  Checkers,
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

export const sceneWithReflections = () => {
  const floor = new Plane({
    transform: Transformations.scale(10, 0.01, 10),
    material: new Material({
      pattern: new Checkers(
        new Color(0.25, 0.25, 0.22),
        new Color(0.5, 0.5, 0.5),
        Transformations.scale(0.25, 0.25, 0.25),
      ),
      specular: 0.5,
      reflective: 0.25,
    }),
  });

  const wallMaterial = new Material({
    color: new Color(0.8, 0.8, 0.8),
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
      color: new Color(0, 0, 0),
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
      color: new Color(0.25, 0, 0),
      diffuse: 0.7,
      specular: 1,
      shininess: 250,
      transparency: 0.9,
      reflective: 1,
    }),
  });

  const light = new Light(new Point(-10, 10, -10), new Color(1, 1, 1));

  const world = new World({
    shapes: [floor, leftWall, rightWall, outer, inner],
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
