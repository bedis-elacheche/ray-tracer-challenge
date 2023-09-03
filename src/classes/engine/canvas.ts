import { clamp, Serializable } from "../core";
import { Color } from "../materials";

export class Canvas implements Serializable {
  public static readonly __name__ = "canvas";
  public width: number;
  public height: number;
  private pixels: Color[][];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.pixels = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => new Color(0, 0, 0)),
    );
  }

  static from(pixels: Color[][]) {
    const allColsHaveSameLength = pixels.every(
      (row) => row.length === pixels[0].length,
    );

    if (!allColsHaveSameLength) {
      return null;
    }

    const canvas = new Canvas(pixels.length, pixels[0].length);

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        canvas.writePixel(x, y, pixels.at(y).at(x));
      }
    }

    return canvas;
  }

  serialize(): JSONObject {
    return { __type: Canvas.__name__, pixels: this.pixels };
  }

  static deserialize({ __type, pixels }: JSONObject) {
    if (__type === Canvas.__name__) {
      return Canvas.from(
        pixels.map((row: JSONObject[]) => row.map(Color.deserialize)),
      );
    }

    throw new Error("Cannot deserialize object.");
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

  private static splitLineIntoChunks(words: string[], maxLength: number) {
    const { lines, line } = words.reduce<{ lines: string[]; line: string }>(
      ({ lines, line }, word) => {
        const newLine = `${line} ${word}`.trim();

        if (newLine.length > maxLength) {
          return {
            lines: [...lines, line],
            line: word,
          };
        }

        if (newLine.length === maxLength) {
          return {
            lines: [...lines, newLine],
            line: "",
          };
        }

        return {
          lines,
          line: newLine,
        };
      },
      { lines: [], line: "" },
    );

    return line ? [...lines, line] : lines;
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

        return Canvas.splitLineIntoChunks(words, 70);
      }),
      "",
    ].join("\n");
  }
}
