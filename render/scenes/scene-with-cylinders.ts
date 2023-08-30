import {
  Camera,
  Checkers,
  Color,
  Cylinder,
  Gradient,
  Light,
  Material,
  Plane,
  Point,
  Ring,
  Stripe,
  Transformations,
  Vector,
  World,
} from "../../src";
import { ProgressBar } from "../progress";

export const sceneWithInfiniteCylinders = (
  name: string,
  progress: ProgressBar,
) => {
  const floor = new Plane({
    transform: Transformations.scale(10, 0.01, 10),
    material: new Material({
      pattern: new Checkers(
        new Color(1, 0, 0.2),
        new Color(1, 1, 1),
        Transformations.scale(0.25, 0.25, 0.25),
      ),
      specular: 0,
    }),
  });

  const wallMaterial = new Material({
    pattern: new Stripe(
      new Color(1, 0, 0.2),
      new Color(1, 1, 1),
      Transformations.scale(0.05, 1, 1),
    ),
    specular: 0,
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

  const middle = new Cylinder({
    transform: Transformations.translation(-0.5, 1, 0.5),
    material: new Material({
      pattern: new Stripe(
        new Color(0.2, 0, 1),
        new Color(1, 1, 1),
        Transformations.rotateZ(Math.PI / 2).multiply(
          Transformations.scale(0.15, 1, 1),
        ),
      ),
      diffuse: 0.7,
      specular: 0.3,
    }),
  });

  const right = new Cylinder({
    transform: Transformations.translation(1.5, 0.5, -0.5).multiply(
      Transformations.scale(0.5, 0.5, 0.5),
    ),
    material: new Material({
      pattern: new Gradient(new Color(1, 0, 1), new Color(1, 1, 1)),
      diffuse: 0.7,
      specular: 0.3,
    }),
  });

  const left = new Cylinder({
    transform: Transformations.translation(-1.5, 0.33, -0.75).multiply(
      Transformations.scale(0.33, 0.33, 0.33),
    ),
    material: new Material({
      pattern: new Ring(
        new Color(0, 1, 1),
        new Color(0, 0, 0),
        Transformations.scale(0.25, 1, 0.25),
      ),
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

const makeSceneWithFiniteCylinders =
  (closed: boolean) => (name: string, progress: ProgressBar) => {
    const floor = new Plane({
      transform: Transformations.scale(10, 0.01, 10),
      material: new Material({
        pattern: new Checkers(
          new Color(1, 0, 0.2),
          new Color(1, 1, 1),
          Transformations.scale(0.25, 0.25, 0.25),
        ),
        specular: 0,
      }),
    });

    const wallMaterial = new Material({
      pattern: new Stripe(
        new Color(1, 0, 0.2),
        new Color(1, 1, 1),
        Transformations.scale(0.05, 1, 1),
      ),
      specular: 0,
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

    const middle = new Cylinder({
      transform: Transformations.translation(-0.5, 1, 0.5),
      material: new Material({
        pattern: new Stripe(
          new Color(0.2, 0, 1),
          new Color(1, 1, 1),
          Transformations.rotateZ(Math.PI / 2).multiply(
            Transformations.scale(0.15, 1, 1),
          ),
        ),
        diffuse: 0.7,
        specular: 0.3,
      }),
      maximum: 2,
      minimum: 0,
      closed,
    });

    const right = new Cylinder({
      transform: Transformations.translation(1.5, 0.5, -0.5).multiply(
        Transformations.scale(0.5, 0.5, 0.5),
      ),
      material: new Material({
        pattern: new Gradient(new Color(1, 0, 1), new Color(1, 1, 1)),
        diffuse: 0.7,
        specular: 0.3,
      }),
      maximum: 3,
      minimum: 1,
      closed,
    });

    const left = new Cylinder({
      transform: Transformations.translation(-1.5, 0.33, -0.75)
        .multiply(Transformations.scale(0.33, 0.33, 0.33))
        .multiply(Transformations.rotateX(Math.PI / 2)),
      material: new Material({
        pattern: new Ring(
          new Color(0, 1, 1),
          new Color(0, 0, 0),
          Transformations.scale(0.25, 1, 0.25),
        ),
        diffuse: 0.7,
        specular: 0.3,
      }),
      maximum: 4,
      minimum: 0,
      closed,
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

export const sceneWithFiniteCylinders = makeSceneWithFiniteCylinders(false);

export const sceneWithFiniteClosedCylinders =
  makeSceneWithFiniteCylinders(true);
