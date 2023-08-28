import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";

import { Camera, Color, EPSILON } from "../src";
import {
  float,
  getCamera,
  getCanvas,
  getNumber,
  getWorld,
  lowercase,
} from "./utils";

Given(
  new RegExp(
    `${lowercase.source} ← camera\\(${float.source}, ${float.source}, π\\/${float.source}\\)`,
  ),
  function (varName: string, hsize: string, vsize: string, divisor: string) {
    this[varName] = new Camera({
      height: parseFloat(hsize),
      width: parseFloat(vsize),
      fieldOfView: Math.PI / parseFloat(divisor),
    });
  },
);

Given("{word} ← π\\/{float}", function (varName: string, divisor: number) {
  this[varName] = Math.PI / divisor;
});

Given(
  new RegExp(
    `${lowercase.source} ← camera\\(${lowercase.source}, ${lowercase.source}, ${lowercase.source}\\)`,
  ),
  function (
    varName: string,
    hsizeVar: string,
    vsizeVar: string,
    fovVar: string,
  ) {
    const height = getNumber(this, hsizeVar);
    const width = getNumber(this, vsizeVar);
    const fieldOfView = getNumber(this, fovVar);

    this[varName] = new Camera({ height, width, fieldOfView });
  },
);

When(
  "{word} ← ray_for_pixel\\({word}, {float}, {float})",
  function (rayVarName: string, cameraVarName: string, x: number, y: number) {
    const camera = getCamera(this, cameraVarName);

    this[rayVarName] = camera.rayForPixel(x, y);
  },
);

When(
  "{word} ← render\\({word}, {word})",
  function (varName: string, cameraVarName: string, worldVarName: string) {
    const camera = getCamera(this, cameraVarName);
    const world = getWorld(this, worldVarName);

    this[varName] = camera.render(world);
  },
);

Then(
  "{word}.field_of_view = π\\/{float}",
  function (varName: string, divisor: number) {
    const camera = getCamera(this, varName);

    expect(
      Math.abs(camera.fieldOfView - Math.PI / divisor),
    ).to.be.lessThanOrEqual(EPSILON);
  },
);

Then(
  "pixel_at\\({word}, {float}, {float}) = color\\({float}, {float}, {float})",
  function (
    varName: string,
    x: number,
    y: number,
    r: number,
    g: number,
    b: number,
  ) {
    const canvas = getCanvas(this, varName);

    expect(canvas.pixelAt(x, y).equals(new Color(r, g, b))).to.be.true;
  },
);
