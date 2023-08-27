import {
  Canvas,
  Color,
  Intersection,
  Light,
  Material,
  Matrix,
  Point,
  Ray,
  Sphere,
  Transformations,
} from "../../src";

const makeScene = (transform?: Matrix) => () => {
  const canvas = new Canvas(300, 300);
  const rayOrigin = new Point(0, 0, -5);
  const wallZ = 10;
  const wallSize = 10;
  const pixelSize = wallSize / canvas.height;
  const half = wallSize / 2;
  const color = new Color(1, 0.2, 1);
  const material = new Material({ color });
  const shape = new Sphere({ transform, material });
  const light = new Light(new Point(-10, 10, -10), new Color(1, 1, 1));

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
          hit.object,
          point,
          eye,
          normal,
          false,
        );
        canvas.writePixel(x, y, castedColor);
      }
    }
  }

  return canvas;
};

export const sphere3D = makeScene();

export const xAxisShrinked3dSphere = makeScene(
  Transformations.scale(0.5, 1, 1),
);

export const yAxisShrinked3dSphere = makeScene(
  Transformations.scale(1, 0.5, 1),
);

export const shrinkedRotated3dSphere = makeScene(
  Transformations.rotateZ(Math.PI / 4).multiply(
    Transformations.scale(0.5, 1, 1),
  ),
);

export const shrinkedSkewd3dSphere = makeScene(
  Transformations.skew(1, 0, 0, 0, 0, 0).multiply(
    Transformations.scale(0.5, 1, 1),
  ),
);