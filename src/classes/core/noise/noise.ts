import { Point } from "../point";
import { Serializable } from "../serializable";

export abstract class Noise implements Serializable {
  abstract jitter(_point: Point, _scale: number): Point;

  serialize(): JSONObject {
    throw new Error("Method not implemented.");
  }

  static deserialize(_json: JSONObject): Noise {
    throw new Error("Method not implemented.");
  }
}
