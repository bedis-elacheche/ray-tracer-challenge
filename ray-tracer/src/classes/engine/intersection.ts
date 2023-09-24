import { Serializable } from "../core";
import { BaseShape, ShapeDeserializer } from "../shapes";

export class Intersection<T extends BaseShape = BaseShape>
  implements Serializable
{
  public static readonly __name__ = "intersection";
  public t: number;
  public object: T;
  public u: number | undefined;
  public v: number | undefined;

  constructor(t: number, object: T, u?: number, v?: number) {
    this.t = t;
    this.object = object;
    this.u = u;
    this.v = v;
  }

  serialize(): JSONObject {
    return {
      __type: Intersection.__name__,
      t: this.t,
      u: this.u,
      v: this.v,
      object: this.object.serialize(),
    };
  }

  static deserialize({ __type, t, object, u, v }: JSONObject) {
    if (__type === Intersection.__name__) {
      return new Intersection(
        +t,
        ShapeDeserializer.deserialize(object) as BaseShape,
        u && +u,
        v && +v,
      );
    }

    throw new Error("Cannot deserialize object.");
  }

  static hit<T extends BaseShape = BaseShape>(
    intersections: Intersection<T>[],
  ): Intersection<T> | null {
    let hit: Intersection<T> | null = null;

    for (const intersection of intersections) {
      if (intersection.t < 0) {
        continue;
      }

      if (!hit || hit.t > intersection.t) {
        hit = intersection;
      }
    }

    return hit;
  }

  equals(intersection: Intersection) {
    if (this === intersection) {
      return true;
    }

    return this.t === intersection.t && this.object.equals(intersection.object);
  }
}
