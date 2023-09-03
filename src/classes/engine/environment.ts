import { Serializable, Vector } from "../core";

export class Environment implements Serializable {
  public static readonly __name__ = "environment";
  public gravity: Vector;
  public wind: Vector;

  constructor(gravity: Vector, wind: Vector) {
    this.gravity = gravity;
    this.wind = wind;
  }

  serialize(): JSONObject {
    return {
      __type: Environment.__name__,
      gravity: this.gravity.serialize(),
      wind: this.wind.serialize(),
    };
  }

  static deserialize({ __type, gravity, wind }: JSONObject) {
    if (__type === Environment.__name__) {
      return new Environment(
        Vector.deserialize(gravity),
        Vector.deserialize(wind),
      );
    }

    throw new Error("Cannot deserialize object.");
  }
}
