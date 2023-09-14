import { Serializable } from "../../../core";
import { Color } from "../../color";

export class UVPattern implements Serializable {
  public static __name__ = "uv-pattern";
  public colors: Color[];
  public width: number;
  public height: number;

  constructor({
    width = 1,
    height = 1,
    colors = [new Color(0, 0, 0), new Color(1, 1, 1)],
  }: {
    width?: number;
    height?: number;
    colors?: Color[];
  } = {}) {
    this.colors = colors;
    this.height = height;
    this.width = width;
  }

  serialize(): JSONObject {
    return {
      __type: UVPattern.__name__,
      colors: this.colors.map((color) => color.serialize()),
      height: this.height,
      width: this.width,
    };
  }

  static deserialize(_json: JSONObject): UVPattern {
    throw new Error("Cannot deserialize object.");
  }

  colorAt(_u: number, _v: number) {
    return new Color(0, 0, 0);
  }

  equals(p: UVPattern) {
    if (p === this) {
      return true;
    }

    return (
      this.constructor.name === p.constructor.name &&
      this.width === p.width &&
      this.height === p.height &&
      this.colors.every((color, i) => color.equals(p.colors[i]))
    );
  }
}
