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

drawProjectile();
drawClock();