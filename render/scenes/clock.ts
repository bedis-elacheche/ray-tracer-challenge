import { Canvas, Color, Point, Transformations } from "../../src";
import { ProgressBar } from "../progress";

export const clock = (name: string, progress: ProgressBar) => {
  const white = new Color(1, 1, 1);
  const red = new Color(1, 0, 0);
  const canvas = new Canvas(400, 400);
  const translateToCenter = Transformations.translation(
    canvas.width / 2,
    canvas.height / 2,
    0,
  );
  const translateFromCenter = Transformations.translation(
    canvas.width / 2.5,
    0,
    0,
  );

  progress.start(name, 12);

  for (let i = 1; i < 13; i++) {
    const rotation = Transformations.rotateZ((Math.PI / 6) * i);
    const point = translateToCenter
      .multiply(rotation)
      .multiply(translateFromCenter)
      .multiply(new Point(0, 0, 0));

    canvas.writePixel(
      Math.round(point.x),
      Math.round(point.y),
      i % 3 ? white : red,
    );

    progress.increment("current");
  }

  return canvas;
};
