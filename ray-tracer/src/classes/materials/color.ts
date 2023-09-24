import { EPSILON, Serializable } from "../core";

export class Color implements Serializable {
  public static readonly __name__ = "color";
  public red: number;
  public green: number;
  public blue: number;

  constructor(red: number, green: number, blue: number) {
    this.red = red;
    this.green = green;
    this.blue = blue;
  }

  serialize(): JSONObject {
    return {
      __type: Color.__name__,
      red: this.red,
      green: this.green,
      blue: this.blue,
    };
  }

  static deserialize({ __type, red, green, blue }: JSONObject) {
    if (__type === Color.__name__) {
      return new Color(+red, +green, +blue);
    }

    throw new Error("Cannot deserialize object.");
  }

  add(color: Color) {
    return new Color(
      this.red + color.red,
      this.green + color.green,
      this.blue + color.blue,
    );
  }

  subtract(color: Color) {
    return new Color(
      this.red - color.red,
      this.green - color.green,
      this.blue - color.blue,
    );
  }

  multiply(item: number | Color) {
    return item instanceof Color
      ? new Color(
          this.red * item.red,
          this.green * item.green,
          this.blue * item.blue,
        )
      : new Color(this.red * item, this.green * item, this.blue * item);
  }

  divide(item: number | Color) {
    return item instanceof Color
      ? new Color(
          this.red / item.red,
          this.green / item.green,
          this.blue / item.blue,
        )
      : new Color(this.red / item, this.green / item, this.blue / item);
  }

  equals(color: Color) {
    return (
      Math.abs(this.red - color.red) <= EPSILON &&
      Math.abs(this.green - color.green) <= EPSILON &&
      Math.abs(this.blue - color.blue) <= EPSILON
    );
  }
}
