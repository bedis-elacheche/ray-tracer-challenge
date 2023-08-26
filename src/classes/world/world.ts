import { EPSILON, Point, Transformations, Vector } from "../core";
import { Color, Material } from "../materials";
import { GroupChild, Shape, Sphere } from "../shapes";
import { Environment } from "./environment";
import { Intersection } from "./intersection";
import { Light } from "./light";
import { Projectile } from "./projectile";
import { Ray } from "./ray";

type Computation = ReturnType<typeof World.prepareComputations>;

export class World {
  public light: Light;
  public children: GroupChild[];

  constructor({
    shapes = [],
    light = null,
  }: {
    shapes?: GroupChild[];
    light?: Light;
  } = {}) {
    this.children = shapes;
    this.light = light;
  }

  static default() {
    const s1 = new Sphere({
      material: new Material({
        color: new Color(0.8, 1, 0.6),
        diffuse: 0.7,
        specular: 0.2,
      }),
    });
    const s2 = new Sphere({
      transform: Transformations.scale(0.5, 0.5, 0.5),
      material: new Material(),
    });
    const light = new Light(new Point(-10, 10, -10), new Color(1, 1, 1));

    return new World({ shapes: [s1, s2], light });
  }

  static tick(env: Environment, proj: Projectile) {
    const position = proj.position.add(proj.velocity);
    const velocity = proj.velocity.add(env.gravity).add(env.wind);

    return new Projectile(position, velocity);
  }

  static prepareComputations(
    hit: Intersection,
    ray: Ray,
    intesections: Intersection[],
  ) {
    const { t, object } = hit;
    const point = ray.position(t);
    const computation = {
      t,
      object,
      point,
      eyev: ray.direction.negate(),
      normalv: object.normalAt(point),
      inside: false,
      overPoint: null as Point,
      underPoint: null as Point,
      reflectv: null as Vector,
      n1: 1,
      n2: 1,
    };

    if (computation.normalv.dot(computation.eyev) < 0) {
      computation.inside = true;
      computation.normalv = computation.normalv.negate();
    }

    const offset = computation.normalv.multiply(EPSILON);
    computation.overPoint = computation.point.add(offset);
    computation.underPoint = computation.point.subtract(offset);
    computation.reflectv = ray.direction.reflect(computation.normalv);

    const containers: Shape[] = [];

    for (const intersection of intesections) {
      if (intersection.equals(hit)) {
        if (containers.length) {
          computation.n1 = containers.at(-1).material.refractiveIndex;
        }
      }

      const objectIndex = containers.findIndex((item) =>
        item.equals(intersection.object),
      );

      if (objectIndex > -1) {
        containers.splice(objectIndex, 1);
      } else {
        containers.push(intersection.object);
      }

      if (intersection.equals(hit)) {
        if (containers.length) {
          computation.n2 = containers.at(-1).material.refractiveIndex;
        }

        break;
      }
    }

    return computation;
  }

  intersect(ray: Ray) {
    const xs = this.children.flatMap((shape) => shape.intersect(ray));

    return xs.filter(({ t }) => t > 0).sort((a, z) => a.t - z.t);
  }

  shadeHit(computation: Computation, remaining = 5) {
    const surface = this.light.apply(
      computation.object.material,
      computation.object,
      computation.point,
      computation.eyev,
      computation.normalv,
      this.isShadowed(computation.overPoint),
    );
    const reflected = this.reflectedColor(computation, remaining);
    const refracted = this.refractedColor(computation, remaining);

    const material = computation.object.material;

    if (material.reflective && material.transparency) {
      const reflectance = World.shlick(computation);

      return surface
        .add(reflected.multiply(reflectance))
        .add(refracted.multiply(1 - reflectance));
    }

    return surface.add(reflected).add(refracted);
  }

  colorAt(ray: Ray, remaining = 5) {
    const intersections = this.intersect(ray);

    if (!intersections.length) {
      return new Color(0, 0, 0);
    }

    return this.shadeHit(
      World.prepareComputations(intersections[0], ray, intersections),
      remaining,
    );
  }

  reflectedColor(computation: Computation, remaining = 5): Color {
    if (remaining === 0 || computation.object.material.reflective === 0) {
      return new Color(0, 0, 0);
    }

    const reflectRay = new Ray(computation.overPoint, computation.reflectv);
    const color = this.colorAt(reflectRay, remaining - 1);

    return color.multiply(computation.object.material.reflective);
  }

  refractedColor(computation: Computation, remaining = 5): Color {
    if (remaining === 0 || computation.object.material.transparency === 0) {
      return new Color(0, 0, 0);
    }

    const nRatio = computation.n1 / computation.n2;
    const cosI = computation.eyev.dot(computation.normalv);
    const sinTSquared = nRatio ** 2 * (1 - cosI ** 2);

    if (sinTSquared > 1) {
      return new Color(0, 0, 0);
    }

    const cosT = Math.sqrt(1 - sinTSquared);
    const direction = computation.normalv
      .multiply(nRatio * cosI - cosT)
      .subtract(computation.eyev.multiply(nRatio));
    const refractRay = new Ray(computation.underPoint, direction);
    const color = this.colorAt(refractRay, remaining - 1);

    return color.multiply(computation.object.material.transparency);
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

  static shlick(computation: Computation) {
    let cos = computation.eyev.dot(computation.normalv);

    if (computation.n1 > computation.n2) {
      const n = computation.n1 / computation.n2;
      const sinTSquared = n ** 2 * (1 - cos ** 2);

      if (sinTSquared > 1) {
        return 1;
      }

      cos = Math.sqrt(1 - sinTSquared);
    }

    const r0 =
      ((computation.n1 - computation.n2) / (computation.n1 + computation.n2)) **
      2;

    return r0 + (1 - r0) * (1 - cos) ** 5;
  }
}
