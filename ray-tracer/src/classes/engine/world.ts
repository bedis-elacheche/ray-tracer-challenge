import { EPSILON, Point, Serializable, Transformations, Vector } from "../core";
import { Light, LightDeserializer, PointLight } from "../light";
import { Color, Material, SolidPattern } from "../materials";
import { BaseShape, Shape, ShapeDeserializer, Sphere } from "../shapes";
import { Environment } from "./environment";
import { Intersection } from "./intersection";
import { Projectile } from "./projectile";
import { Ray } from "./ray";

export type Computation = ReturnType<typeof World.prepareComputations>;

export class World implements Serializable {
  public static readonly __name__ = "world";
  public lights: Light[];
  public children: BaseShape[];

  constructor({
    shapes = [],
    lights = [],
  }: {
    shapes?: BaseShape[];
    lights?: Light[];
  } = {}) {
    this.children = shapes;
    this.lights = lights;
  }

  serialize(): JSONObject {
    return {
      __type: World.__name__,
      lights: this.lights.map((item) => item.serialize()),
      children: this.children.map((item) => item.serialize()),
    };
  }

  static deserialize({ __type, lights, children }: JSONObject) {
    if (__type === World.__name__) {
      return new World({
        lights: lights.map(LightDeserializer.deserialize),
        shapes: children.map(ShapeDeserializer.deserialize),
      });
    }

    throw new Error("Cannot deserialize object.");
  }

  static default() {
    const s1 = new Sphere({
      material: new Material({
        pattern: SolidPattern.from(0.8, 1, 0.6),
        diffuse: 0.7,
        specular: 0.2,
      }),
    });
    const s2 = new Sphere({
      transform: Transformations.scale(0.5, 0.5, 0.5),
      material: new Material(),
    });
    const light = new PointLight({
      position: new Point(-10, 10, -10),
      intensity: new Color(1, 1, 1),
    });

    return new World({ shapes: [s1, s2], lights: [light] });
  }

  static tick(env: Environment, proj: Projectile) {
    const position = proj.position.add(proj.velocity);
    const velocity = proj.velocity.add(env.gravity).add(env.wind);

    return new Projectile(position, velocity);
  }

  static prepareComputations(
    hit: Intersection<Shape>,
    ray: Ray,
    intesections: Intersection<Shape>[],
  ) {
    const { t, object } = hit;
    const point = ray.position(t);
    const computation = {
      t,
      object,
      point,
      eyev: ray.direction.negate(),
      normalv: object.normalAt(point, hit),
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
    const xs = this.children.flatMap((shape) =>
      shape.intersect(ray),
    ) as Intersection<Shape>[];

    return xs.filter(({ t }) => t > 0).sort((a, z) => a.t - z.t);
  }

  shadeHit(computation: Computation, remaining = 5) {
    let color = new Color(0, 0, 0);

    for (const light of this.lights) {
      const surface = light.apply(
        computation.object.material,
        computation.object,
        computation.overPoint,
        computation.eyev,
        computation.normalv,
        light.intensityAt(computation.overPoint, this),
      );
      const reflected = this.reflectedColor(computation, remaining);
      const refracted = this.refractedColor(computation, remaining);

      const material = computation.object.material;

      if (material.reflective && material.transparency) {
        const reflectance = World.shlick(computation);

        color = color
          .add(surface)
          .add(reflected.multiply(reflectance))
          .add(refracted.multiply(1 - reflectance));
      } else {
        color = color.add(surface).add(reflected).add(refracted);
      }
    }

    return color;
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

  isShadowed(point: Point, lightPosition: Point) {
    const vector = lightPosition.subtract(point);
    const distance = vector.magnitude();
    const direction = vector.normalize();
    const ray = new Ray(point, direction);
    const intersections = this.intersect(ray);
    const hit = Intersection.hit(intersections);

    if (hit && hit.t < distance && hit.object.hasShadow) {
      return true;
    }

    return false;
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

  equals(w: World) {
    if (w === this) {
      return true;
    }

    return (
      this.lights.every((light, index) => light.equals(w.lights.at(index))) &&
      this.children.every((child, index) => child.equals(w.children.at(index)))
    );
  }
}
