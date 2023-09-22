import {
  Canvas,
  Color,
  Intersection,
  Material,
  Matrix,
  Point,
  PointLight,
  Ray,
  Shape,
  SolidPattern,
  Sphere,
  Transformations,
} from "../../src";
import { ProgressBar } from "../progress";

const makeScene =
  (transform?: Matrix) => (name: string, progress: ProgressBar) => {
    const canvas = new Canvas({ height: 800, width: 800 });
    const rayOrigin = new Point(0, 0, -5);
    const wallZ = 10;
    const wallSize = 10;
    const pixelSize = wallSize / canvas.height;
    const half = wallSize / 2;
    const material = new Material({ pattern: SolidPattern.from(1, 0.2, 1) });
    const shape = new Sphere({ transform, material });
    const light = new PointLight({
      position: new Point(-10, 10, -10),
      intensity: new Color(1, 1, 1),
    });

    progress.start(name, canvas.height * canvas.width);

    for (let y = 0; y < canvas.height; y++) {
      const worldY = half - pixelSize * y;
      for (let x = 0; x < canvas.width; x++) {
        const worldX = -half + pixelSize * x;

        const position = new Point(worldX, worldY, wallZ);
        const ray = new Ray(
          rayOrigin,
          position.subtract(rayOrigin).normalize(),
        );
        const eye = ray.direction.negate();
        const xs = shape.intersect(ray);
        const hit = Intersection.hit<Shape>(xs);

        if (hit) {
          const point = ray.position(hit.t);
          const normal = hit.object.normalAt(point);
          const castedColor = light.apply(
            hit.object.material,
            hit.object,
            point,
            eye,
            normal,
            1,
          );
          canvas.writePixel(x, y, castedColor);
        }

        progress.increment("current");
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
