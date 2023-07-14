import { Given, Then } from "@cucumber/cucumber";
import { Point, Transformations, Vector } from "../src";
import { expect } from "chai";
import { getMatrix, getPoint, getTuple, getVector } from "./utils";

Given(
  "{word} ← translation\\({float}, {float}, {float})",
  function (varName: string, x: number, y: number, z: number) {
    this[varName] = Transformations.translation(x, y, z);
  }
);

Given(
  "{word} ← scaling\\({float}, {float}, {float})",
  function (varName: string, x: number, y: number, z: number) {
    this[varName] = Transformations.scale(x, y, z);
  }
);

Given(
  "{word} ← rotation_x\\(π \\/ {float})",
  function (varName: string, divisor: number) {
    this[varName] = Transformations.rotateX(Math.PI / divisor);
  }
);

Given(
  "{word} ← rotation_y\\(π \\/ {float})",
  function (varName: string, divisor: number) {
    this[varName] = Transformations.rotateY(Math.PI / divisor);
  }
);

Given(
  "{word} ← rotation_z\\(π \\/ {float})",
  function (varName: string, divisor: number) {
    this[varName] = Transformations.rotateZ(Math.PI / divisor);
  }
);

Given(
  "{word} ← shearing\\({float}, {float}, {float}, {float}, {float}, {float})",
  function (
    varName: string,
    xy: number,
    xz: number,
    yx: number,
    yz: number,
    zx: number,
    zy: number
  ) {
    this[varName] = Transformations.skew(xy, xz, yx, yz, zx, zy);
  }
);

Then(
  "{word} ← inverse\\({word})",
  function (firstVarName: string, secondVarName: string) {
    const matrix = getMatrix(this, secondVarName);

    this[firstVarName] = matrix.inverse();
  }
);

Then(
  "transform * {word} = {word}",
  function (firstVarName: string, secondVarName: string) {
    expect(firstVarName).to.eql(secondVarName);

    const transformationMatrix = getMatrix(this, "transform");
    const tuple = getTuple(this, firstVarName);

    expect(transformationMatrix.multiply(tuple).equals(tuple)).to.be.true;
  }
);

Then(
  "{word} * {word} = point\\({float}, {float}, {float})",
  function (
    transformationVarName: string,
    varName: string,
    x: number,
    y: number,
    z: number
  ) {
    const transformationMatrix = getMatrix(this, transformationVarName);
    const point = getPoint(this, varName);

    expect(transformationMatrix.multiply(point).equals(new Point(x, y, z))).to
      .be.true;
  }
);

Then(
  "{word} * {word} = vector\\({float}, {float}, {float})",
  function (
    transformationVarName: string,
    varName: string,
    x: number,
    y: number,
    z: number
  ) {
    const transformationMatrix = getMatrix(this, transformationVarName);
    const vector = getVector(this, varName);

    expect(transformationMatrix.multiply(vector).equals(new Vector(x, y, z))).to
      .be.true;
  }
);
