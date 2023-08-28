import {
  Canvas,
  Color,
  Intersection,
  Matrix,
  Point,
  Ray,
  Sphere,
  Transformations,
} from "../../src";

const makeScene = (transform?: Matrix) => () => {
  const canvas = new Canvas(800, 800);
  const rayOrigin = new Point(0, 0, -5);
  const wallZ = 10;
  const wallSize = 10;
  const pixelSize = wallSize / canvas.height;
  const half = wallSize / 2;
  const color = new Color(1, 0, 0);
  const shape = new Sphere({ transform });

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

  return canvas;
};

export const sphere = makeScene();

export const xAxisShrinkedSphere = makeScene(Transformations.scale(0.5, 1, 1));

export const yAxisShrinkedSphere = makeScene(Transformations.scale(1, 0.5, 1));

export const shrinkedRotatedSphere = makeScene(
  Transformations.rotateZ(Math.PI / 4).multiply(
    Transformations.scale(0.5, 1, 1),
  ),
);

export const shrinkedSkewdSphere = makeScene(
  Transformations.skew(1, 0, 0, 0, 0, 0).multiply(
    Transformations.scale(0.5, 1, 1),
  ),
);
