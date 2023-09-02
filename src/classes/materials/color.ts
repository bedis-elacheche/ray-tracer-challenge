import { EPSILON } from "../core";

export class Color {
  public red: number;
  public green: number;
  public blue: number;

  constructor(red: number, green: number, blue: number) {
    this.red = red;
    this.green = green;
    this.blue = blue;
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

  equals(color: Color) {
    return (
      Math.abs(this.red - color.red) <= EPSILON &&
      Math.abs(this.green - color.green) <= EPSILON &&
      Math.abs(this.blue - color.blue) <= EPSILON
    );
  }
}
