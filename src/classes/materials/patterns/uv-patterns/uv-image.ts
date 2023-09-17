import { Canvas } from "../../../engine";
import { UVPattern } from "./uv-pattern";

export class UVImage extends UVPattern {
  public static readonly __name__ = "uv-image-pattern";
  public canvas: Canvas;

  constructor({ canvas }: { canvas: Canvas }) {
    super({
      colors: [],
    });
    this.canvas = canvas;
  }

  colorAt(u: number, v: number) {
    const x = u * (this.canvas.width - 1);
    const y = (1 - v) * (this.canvas.height - 1);

    return this.canvas.pixelAt(Math.round(x), Math.round(y));
  }

  serialize(): JSONObject {
    return {
      __type: UVImage.__name__,
      canvas: this.canvas.serialize(),
    };
  }

  static deserialize({ __type, canvas }: JSONObject) {
    if (__type === UVImage.__name__) {
      return new UVImage({
        canvas: Canvas.deserialize(canvas),
      });
    }

    throw new Error("Cannot deserialize object.");
  }
}
