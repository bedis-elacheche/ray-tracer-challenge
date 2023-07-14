import { clamp, splitLineIntoChunks } from "../utils";
import { Color } from "./color";
export class Canvas {
  public width: number;
  public height: number;
  private pixels: Color[][];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.pixels = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => new Color(0, 0, 0))
    );
  }

  pixelAt(x: number, y: number) {
    if (
      clamp(0, this.width - 1, x) !== x ||
      clamp(0, this.height - 1, y) !== y
    ) {
      return null;
    }

    return this.pixels.at(y).at(x);
  }

  writePixel(x: number, y: number, color: Color) {
    if (
      clamp(0, this.width - 1, x) === x &&
      clamp(0, this.height - 1, y) === y
    ) {
      this.pixels[y][x] = color;
    }

    return this;
  }

  toPPM() {
    const max = 255;
    const exportColor = (color: number) =>
      Math.round(clamp(0, 1, color) * max).toString();

    return [
      "P3",
      `${this.width} ${this.height}`,
      max,
      ...this.pixels.flatMap((row) => {
        const words = row.flatMap((color) => [
          exportColor(color.red),
          exportColor(color.green),
          exportColor(color.blue),
        ]);

        return splitLineIntoChunks(words, 70);
      }),
      "",
    ].join("\n");
  }
}
