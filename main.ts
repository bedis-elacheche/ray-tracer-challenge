import {
  Point,
  Vector,
  Projectile,
  Environment,
  World,
  EPSILON,
  Canvas,
  Color,
} from "./src";
import { writeFileSync } from "fs";

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

writeFileSync("./output.ppm", canvas.toPPM());
