import {
  Point,
  Vector,
  Projectile,
  Environment,
  World,
  EPSILON,
  Canvas,
  Color,
  Transformations,
  Sphere,
  Ray,
  Intersection,
  Matrix,
  Material,
  Light,
  Camera,
  Plane,
} from "./src";
import { writeFileSync } from "fs";

const drawProjectile = () => {
  const position = new Point(0, 1, 0);
  const velocity = new Vector(1, 1.8, 0).normalize().multiply(11.25);
  let projectile = new Projectile(position, velocity);

  const gravity = new Vector(0, -0.1, 0);
  const wind = new Vector(-0.01, 0, 0);
  const environment = new Environment(gravity, wind);

  const canvas = new Canvas(900, 500);
  const color = new Color(1, 1, 1);

  while (projectile.position.y > EPSILON) {
    projectile = World.tick(environment, projectile);
    canvas.writePixel(
      Math.round(projectile.position.x),
      canvas.height - Math.round(projectile.position.y),
      color
    );
  }

  writeFileSync("./photos/projectile.ppm", canvas.toPPM());
};

const drawClock = () => {
  const white = new Color(1, 1, 1);
  const red = new Color(1, 0, 0);
  const canvas = new Canvas(400, 400);
  const translateToCenter = Transformations.translation(
    canvas.width / 2,
    canvas.height / 2,
    0
  );
  const translateFromCenter = Transformations.translation(
    canvas.width / 2.5,
    0,
    0
  );

  for (let i = 1; i < 13; i++) {
    const rotation = Transformations.rotateZ((Math.PI / 6) * i);
    const point = translateToCenter
      .multiply(rotation)
      .multiply(translateFromCenter)
      .multiply(new Point(0, 0, 0));

    canvas.writePixel(
      Math.round(point.x),
      Math.round(point.y),
      i % 3 ? white : red
    );
  }

  writeFileSync("./photos/clock.ppm", canvas.toPPM());
};

const drawSphere = (prefix: string, transform?: Matrix) => {
  const canvas = new Canvas(300, 300);
  const rayOrigin = new Point(0, 0, -5);
  const wallZ = 10;
  const wallSize = 10;

  const pixelSize = wallSize / canvas.height;
  const half = wallSize / 2;
  const color = new Color(1, 0, 0);
  const shape = new Sphere();

  if (transform) {
    shape.transform = transform;
  }

  for (let y = 0; y < canvas.height; y++) {
    const worldY = half - pixelSize * y;
    for (let x = 0; x < canvas.width; x++) {
      const worldX = -half + pixelSize * x;

      const position = new Point(worldX, worldY, wallZ);
      const ray = new Ray(rayOrigin, position.subtract(rayOrigin).normalize());
      const xs = shape.intersect(ray);

      if (Intersection.hit(xs)) {
        canvas.writePixel(x, y, color);
      }
    }
  }

  writeFileSync(`./photos/${prefix}-sphere.ppm`, canvas.toPPM());
};

const draw3DSphere = (prefix: string, transform?: Matrix) => {
  const canvas = new Canvas(300, 300);
  const rayOrigin = new Point(0, 0, -5);
  const wallZ = 10;
  const wallSize = 10;

  const pixelSize = wallSize / canvas.height;
  const half = wallSize / 2;
  const color = new Color(1, 0.2, 1);
  const material = new Material();
  material.color = color;
  const shape = new Sphere();
  shape.material = material;
  const light = new Light(new Point(-10, 10, -10), new Color(1, 1, 1));

  if (transform) {
    shape.transform = transform;
  }

  for (let y = 0; y < canvas.height; y++) {
    const worldY = half - pixelSize * y;
    for (let x = 0; x < canvas.width; x++) {
      const worldX = -half + pixelSize * x;

      const position = new Point(worldX, worldY, wallZ);
      const ray = new Ray(rayOrigin, position.subtract(rayOrigin).normalize());
      const eye = ray.direction.negate();
      const xs = shape.intersect(ray);
      const hit = Intersection.hit(xs);

      if (hit) {
        const point = ray.position(hit.t);
        const normal = hit.object.normalAt(point);
        const castedColor = light.apply(
          hit.object.material,
          point,
          eye,
          normal,
          false
        );
        canvas.writePixel(x, y, castedColor);
      }
    }
  }

  writeFileSync(`./photos/${prefix}-3d-sphere.ppm`, canvas.toPPM());
};

const drawScene = () => {
  const floor = new Sphere(
    undefined,
    Transformations.scale(10, 0.01, 10),
    new Material({
      color: new Color(1, 0.9, 0.9),
      specular: 0,
    })
  );

  const leftWall = new Sphere(
    undefined,
    Transformations.translation(0, 0, 5)
      .multiply(Transformations.rotateY(-Math.PI / 4))
      .multiply(Transformations.rotateX(Math.PI / 2))
      .multiply(Transformations.scale(10, 0.01, 10)),
    floor.material
  );

  const rightWall = new Sphere(
    undefined,
    Transformations.translation(0, 0, 5)
      .multiply(Transformations.rotateY(Math.PI / 4))
      .multiply(Transformations.rotateX(Math.PI / 2))
      .multiply(Transformations.scale(10, 0.01, 10)),
    floor.material
  );

  const middle = new Sphere(
    undefined,
    Transformations.translation(-0.5, 1, 0.5),
    new Material({
      color: new Color(0.1, 1, 0.5),
      diffuse: 0.7,
      specular: 0.3,
    })
  );

  const right = new Sphere(
    undefined,
    Transformations.translation(1.5, 0.5, -0.5).multiply(
      Transformations.scale(0.5, 0.5, 0.5)
    ),
    new Material({
      color: new Color(0.5, 1, 0.1),
      diffuse: 0.7,
      specular: 0.3,
    })
  );

  const left = new Sphere(
    undefined,
    Transformations.translation(-1.5, 0.33, -0.75).multiply(
      Transformations.scale(0.33, 0.33, 0.33)
    ),
    new Material({
      color: new Color(1, 0.8, 0.1),
      diffuse: 0.7,
      specular: 0.3,
    })
  );

  const light = new Light(new Point(-10, 10, -10), new Color(1, 1, 1));

  const world = new World(
    [floor, leftWall, rightWall, middle, left, right],
    light
  );

  const camera = new Camera(
    300,
    300,
    Math.PI / 3,
    Transformations.viewTransform(
      new Point(0, 1.5, -5),
      new Point(0, 1, 0),
      new Vector(0, 1, 0)
    )
  );

  const canvas = camera.render(world);

  // writeFileSync("./photos/3d-scene.ppm", canvas.toPPM());
  writeFileSync("./photos/3d-scene-with-shadows.ppm", canvas.toPPM());
};

const drawSceneWithPlane = () => {
  const floor = new Plane(
    undefined,
    Transformations.scale(10, 0.01, 10),
    new Material({
      color: new Color(1, 0.9, 0.9),
      specular: 0,
    })
  );

  const middle = new Sphere(
    undefined,
    Transformations.translation(-0.5, 1, 0.5),
    new Material({
      color: new Color(0.1, 1, 0.5),
      diffuse: 0.7,
      specular: 0.3,
    })
  );

  const right = new Sphere(
    undefined,
    Transformations.translation(1.5, 0.5, -0.5).multiply(
      Transformations.scale(0.5, 0.5, 0.5)
    ),
    new Material({
      color: new Color(0.5, 1, 0.1),
      diffuse: 0.7,
      specular: 0.3,
    })
  );

  const left = new Sphere(
    undefined,
    Transformations.translation(-1.5, 0.33, -0.75).multiply(
      Transformations.scale(0.33, 0.33, 0.33)
    ),
    new Material({
      color: new Color(1, 0.8, 0.1),
      diffuse: 0.7,
      specular: 0.3,
    })
  );

  const light = new Light(new Point(-10, 10, -10), new Color(1, 1, 1));

  const world = new World([floor, middle, left, right], light);

  const camera = new Camera(
    300,
    300,
    Math.PI / 3,
    Transformations.viewTransform(
      new Point(0, 1.5, -5),
      new Point(0, 1, 0),
      new Vector(0, 1, 0)
    )
  );

  const canvas = camera.render(world);

  writeFileSync("./photos/3d-scene-with-plane.ppm", canvas.toPPM());
};

// drawProjectile();
// drawClock();
// drawSphere("default");
// drawSphere("x-axis-shrink", Transformations.scale(0.5, 1, 1));
// drawSphere("y-axis-shrink", Transformations.scale(1, 0.5, 1));
// drawSphere(
//   "shrinked-rotated",
//   Transformations.rotateZ(Math.PI / 4).multiply(
//     Transformations.scale(0.5, 1, 1)
//   )
// );
// drawSphere(
//   "shrinked-skewd",
//   Transformations.skew(1, 0, 0, 0, 0, 0).multiply(
//     Transformations.scale(0.5, 1, 1)
//   )
// );
// draw3DSphere("default");
// draw3DSphere("x-axis-shrink", Transformations.scale(0.5, 1, 1));
// draw3DSphere("y-axis-shrink", Transformations.scale(1, 0.5, 1));
// draw3DSphere(
//   "shrinked-rotated",
//   Transformations.rotateZ(Math.PI / 4).multiply(
//     Transformations.scale(0.5, 1, 1)
//   )
// );
// draw3DSphere(
//   "shrinked-skewd",
//   Transformations.skew(1, 0, 0, 0, 0, 0).multiply(
//     Transformations.scale(0.5, 1, 1)
//   )
// );
// drawScene();
drawSceneWithPlane();