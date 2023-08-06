import { EPSILON, Point, Transformations } from "../core";
import { Color, Material } from "../materials";
import { Shape, Sphere } from "../shapes";
import { Environment } from "./environment";
import { Intersection } from "./intersection";
import { Light } from "./light";
import { Projectile } from "./projectile";
import { Ray } from "./ray";

export class World {
  public light: Light;
  public shapes: Shape[];

  constructor(shapes = [] as Shape[], light = null as Light) {
    this.shapes = shapes;
    this.light = light;
  }

  static default() {
    const s1 = new Sphere(
      undefined,
      undefined,
      new Material({
        color: new Color(0.8, 1, 0.6),
        diffuse: 0.7,
        specular: 0.2,
      }),
    );
    const s2 = new Sphere(
      undefined,
      Transformations.scale(0.5, 0.5, 0.5),
      new Material(),
    );
    const light = new Light(new Point(-10, 10, -10), new Color(1, 1, 1));

    return new World([s1, s2], light);
  }

  static tick(env: Environment, proj: Projectile) {
    const position = proj.position.add(proj.velocity);
    const velocity = proj.velocity.add(env.gravity).add(env.wind);

    return new Projectile(position, velocity);
  }

  static prepareComputations(intersection: Intersection, ray: Ray) {
    const { t, object } = intersection;
    const point = ray.position(t);
    const computation = {
      t,
      object,
      point,
      eyev: ray.direction.negate(),
      normalv: intersection.object.normalAt(point),
      inside: false,
      overPoint: null as Point,
    };

    if (computation.normalv.dot(computation.eyev) < 0) {
      computation.inside = true;
      computation.normalv = computation.normalv.negate();
    }

    computation.overPoint = computation.point.add(
      computation.normalv.multiply(EPSILON),
    );

    return computation;
  }

  intersect(ray: Ray) {
    const xs = this.shapes.flatMap((shape) => shape.intersect(ray));

    return xs.filter(({ t }) => t > 0).sort((a, z) => a.t - z.t);
  }

  shadeHit(computation: ReturnType<typeof World.prepareComputations>) {
    return this.light.apply(
      computation.object.material,
      computation.object,
      computation.point,
      computation.eyev,
      computation.normalv,
      this.isShadowed(computation.overPoint),
    );
  }

  colorAt(ray: Ray) {
    const [hit] = this.intersect(ray);

    if (!hit) {
      return new Color(0, 0, 0);
    }

    return this.shadeHit(World.prepareComputations(hit, ray));
  }

  isShadowed(point: Point) {
    const vector = this.light.position.subtract(point);
    const distance = vector.magnitude();
    const direction = vector.normalize();
    const ray = new Ray(point, direction);
    const intersections = this.intersect(ray);
    const hit = Intersection.hit(intersections);

    return hit ? hit.t < distance : false;
  }
}
