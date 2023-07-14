import { Given, Then, When } from "@cucumber/cucumber";
import { Canvas, Color } from "../src";
import { expect } from "chai";
import { getCanvas, getColor, getString } from "./utils";

Given(
  "{word} ← canvas\\({float}, {float})",
  function (varName: string, w: number, h: number) {
    this[varName] = new Canvas(w, h);
  }
);

When(
  "write_pixel\\({word}, {float}, {float}, {word})",
  function (canvasVarName: string, x: number, y: number, colorVarName: string) {
    const canvas = getCanvas(this, canvasVarName);
    const color = getColor(this, colorVarName);

    canvas.writePixel(x, y, color);
  }
);

When(
  "every pixel of {word} is set to color\\({float}, {float}, {float})",
  function (varName: string, r: number, g: number, b: number) {
    const canvas = getCanvas(this, varName);
    const color = new Color(r, g, b);

    for (let x = 0; x < canvas.width; x++) {
      for (let y = 0; y < canvas.height; y++) {
        canvas.writePixel(x, y, color);
      }
    }
  }
);

When(
  "{word} ← canvas_to_ppm\\({word})",
  function (varName: string, canvasVarName: string) {
    const canvas = getCanvas(this, canvasVarName);

    this[varName] = canvas.toPPM();
  }
);

Then(
  "every pixel of {word} is color\\({float}, {float}, {float})",
  function (varName: string, r: number, g: number, b: number) {
    const canvas = getCanvas(this, varName);
    const color = new Color(r, g, b);

    for (let x = 0; x < canvas.width; x++) {
      for (let y = 0; y < canvas.height; y++) {
        expect(canvas.pixelAt(x, y).equals(color)).to.be.true;
      }
    }
  }
);

Then(
  "pixel_at\\({word}, {float}, {float}) = {word}",
  function (canvasVarName: string, x: number, y: number, colorVarName: string) {
    const canvas = getCanvas(this, canvasVarName);
    const color = getColor(this, colorVarName);

    expect(canvas.pixelAt(x, y).equals(color)).to.be.true;
  }
);

Then(
  "lines {int}-{int} of {word} are",
  function (
    from: number,
    to: number,
    varName: string,
    expectedContent: string
  ) {
    const file = getString(this, varName);

    expect(
      file
        .split("\n")
        .slice(from - 1, to)
        .join("\n")
    ).to.eql(expectedContent);
  }
);

Then("{word} ends with a newline character", function (varName: string) {
  const file = getString(this, varName);

  expect(file.endsWith("\n")).to.be.true;
});
