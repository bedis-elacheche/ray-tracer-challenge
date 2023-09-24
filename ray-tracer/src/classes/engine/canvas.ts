import { clamp, Serializable } from "../core";
import { Color } from "../materials";

export class Canvas implements Serializable {
  public static readonly __name__ = "canvas";
  public width: number;
  public height: number;
  private pixels: Color[][];

  constructor({ width, height }: { width: number; height: number }) {
    this.width = width;
    this.height = height;
    this.pixels = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => new Color(0, 0, 0)),
    );
  }

  static from(ppm: string): Canvas;
  static from(pixels: Color[][]): Canvas;
  static from(input: string | Color[][]): Canvas {
    if (typeof input === "string") {
      const lines = input
        .split("\n")
        .filter((line) => !line.startsWith("#") && line !== "");

      if (lines[0] !== "P3") {
        throw new Error("Parse error");
      }

      const [width, height] = lines[1].split(" ").map(parseFloat);
      const canvas = new Canvas({ width, height });
      const scale = parseFloat(lines[2]);

      const { x, y, color } = lines
        .slice(3)
        .join(" ")
        .split(/\s+/)
        .reduce<{
          x: number;
          y: number;
          color: number[];
        }>(
          ({ x, y, color }, item) => {
            const component = parseFloat(item) / scale;

            color.push(component);

            if (color.length === 3) {
              canvas.writePixel(x, y, new Color(color[0], color[1], color[2]));
              color = [];
              x++;

              if (x >= canvas.width) {
                x = 0;
                y++;
              }
            }

            return {
              x,
              y,
              color,
            };
          },
          {
            x: 0,
            y: 0,
            color: [],
          },
        );

      if (color.length) {
        canvas.writePixel(
          x,
          y,
          new Color(color[0], color[1] ?? 0, color[2] ?? 0),
        );
      }

      return canvas;
    } else {
      const allColsHaveSameLength = input.every(
        (row) => row.length === input[0].length,
      );

      if (!allColsHaveSameLength) {
        return null;
      }

      const canvas = new Canvas({
        width: input.length,
        height: input[0].length,
      });

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          canvas.writePixel(x, y, input.at(y).at(x));
        }
      }

      return canvas;
    }
  }

  serialize(): JSONObject {
    return {
      __type: Canvas.__name__,
      pixels: this.pixels.map((row) => row.map((color) => color.serialize())),
    };
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
    const scale = 255;
    const exportColor = (color: number) =>
      Math.round(clamp(0, 1, color) * scale).toString();

    return [
      "P3",
      `${this.width} ${this.height}`,
      scale,
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
