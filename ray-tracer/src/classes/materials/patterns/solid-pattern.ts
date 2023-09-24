import { Point } from "../../core";
import { BaseShape } from "../../shapes";
import { Color } from "../color";
import { Pattern } from "./pattern";

export class SolidPattern implements Pattern {
  public static __name__ = "solid-pattern";
  public color: Color;

  static Black() {
    return new SolidPattern({
      color: new Color(0, 0, 0),
    });
  }

  static White() {
    return new SolidPattern({
      color: new Color(1, 1, 1),
    });
  }

  static from(r: number, g: number, b: number) {
    return new SolidPattern({
      color: new Color(r, g, b),
    });
  }

  constructor({
    color = new Color(1, 1, 1),
  }: {
    color?: Color;
  } = {}) {
    this.color = color;
  }

  colorAt(_u: number, _v: number): Color;
  colorAt(_p: Point, _s?: BaseShape): Color;
  colorAt(_: Point | number, __: BaseShape | number): Color {
    return this.color;
  }

  serialize(): JSONObject {
    return {
      __type: SolidPattern.__name__,
      color: this.color.serialize(),
    };
  }

  static deserialize({ __type, color }: JSONObject): SolidPattern {
    if (__type === SolidPattern.__name__) {
      return new SolidPattern({
        color: Color.deserialize(color),
      });
    }

    throw new Error("Cannot deserialize object.");
  }

  equals(p: SolidPattern): boolean {
    if (p === this) {
      return true;
    }

    return this.color.equals(p.color);
  }
}
