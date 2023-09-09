import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";

import { Group, Point, Shape, Transformations, Vector } from "../src";
import {
  float,
  getGroup,
  getMatrix,
  getPoint,
  getShape,
  getShapeOrGroup,
  getTuple,
  getVector,
  lowercase,
} from "./utils";

Given(
  "{word} ← translation\\({float}, {float}, {float})",
  function (varName: string, x: number, y: number, z: number) {
    this[varName] = Transformations.translation(x, y, z);
  },
);

Given(
  "{word} ← scaling\\({float}, {float}, {float})",
  function (varName: string, x: number, y: number, z: number) {
    this[varName] = Transformations.scale(x, y, z);
  },
);

Given(
  "{word} ← rotation_x\\(π \\/ {float})",
  function (varName: string, divisor: number) {
    this[varName] = Transformations.rotateX(Math.PI / divisor);
  },
);

Given(
  "{word} ← rotation_y\\(π \\/ {float})",
  function (varName: string, divisor: number) {
    this[varName] = Transformations.rotateY(Math.PI / divisor);
  },
);

Given(
  "{word} ← scaling\\({float}, {float}, {float}) * rotation_z\\(π \\/ {float})",
  function (varName: string, x: number, y: number, z: number, divisor: number) {
    this[varName] = Transformations.scale(x, y, z).multiply(
      Transformations.rotateZ(Math.PI / divisor),
    );
  },
);

Given(
  "{word} ← rotation_x\\(π \\/ {float}) * rotation_y\\(π \\/ {float})",
  function (
    varName: string,
    rotationXDivisor: number,
    rotationYDivisor: number,
  ) {
    this[varName] = Transformations.rotateX(
      Math.PI / rotationXDivisor,
    ).multiply(Transformations.rotateY(Math.PI / rotationYDivisor));
  },
);

Given(
  "{word} ← rotation_z\\(π \\/ {float})",
  function (varName: string, divisor: number) {
    this[varName] = Transformations.rotateZ(Math.PI / divisor);
  },
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
    zy: number,
  ) {
    this[varName] = Transformations.skew(xy, xz, yx, yz, zx, zy);
  },
);

Given(
  "{word} ← inverse\\({word})",
  function (firstVarName: string, secondVarName: string) {
    const matrix = getMatrix(this, secondVarName);

    this[firstVarName] = matrix.inverse();
  },
);

When(
  "^{word} ← scaling\\({float}, {float}, {float})$",
  function (varName: string, x: number, y: number, z: number) {
    this[varName] = Transformations.scale(x, y, z);
  },
);

When(
  new RegExp(
    `^${lowercase.source} ← view_transform\\(${lowercase.source}, ${lowercase.source}, ${lowercase.source}\\)$`,
  ),
  function (
    varName: string,
    firstVarName: string,
    secondVarName: string,
    thirdVarName: string,
  ) {
    const from = getPoint(this, firstVarName);
    const to = getPoint(this, secondVarName);
    const up = getVector(this, thirdVarName);

    this[varName] = Transformations.viewTransform(from, to, up);
  },
);

When(
  new RegExp(
    `^${lowercase.source}\\.transform ← view_transform\\(${lowercase.source}, ${lowercase.source}, ${lowercase.source}\\)$`,
  ),
  function (
    varName: string,
    firstVarName: string,
    secondVarName: string,
    thirdVarName: string,
  ) {
    const from = getPoint(this, firstVarName);
    const to = getPoint(this, secondVarName);
    const up = getVector(this, thirdVarName);

    this[varName].transform = Transformations.viewTransform(from, to, up);
  },
);

When(
  "{word}.transform ← rotation_y\\(π\\/{float}) * translation\\({float}, {float}, {float})",
  function (varName: string, divisor: number, x: number, y: number, z: number) {
    this[varName].transform = Transformations.rotateY(
      Math.PI / divisor,
    ).multiply(Transformations.translation(x, y, z));
  },
);

When(
  "{word} ← world_to_object\\({word}, point\\({float}, {float}, {float}))",
  function (
    varName: string,
    shapeName: string,
    x: number,
    y: number,
    z: number,
  ) {
    let item: Group | Shape;

    try {
      item = getShape(this, shapeName);
    } catch (e) {
      item = getGroup(this, shapeName);
    }

    this[varName] = Transformations.worldToObject(item, new Point(x, y, z));
  },
);

When(
  "{word} ← normal_to_world\\({word}, vector\\({float}, {float}, {float}))",
  function (
    varName: string,
    shapeName: string,
    x: number,
    y: number,
    z: number,
  ) {
    const item = getShapeOrGroup(this, shapeName);

    this[varName] = Transformations.normalToWorld(item, new Vector(x, y, z));
  },
);

Then(
  new RegExp(
    `^${lowercase.source} = translation\\(${float.source}, ${float.source}, ${float.source}\\)$`,
  ),
  function (varName: string, x: string, y: string, z: string) {
    const transformationMatrix = getMatrix(this, varName);

    expect(
      transformationMatrix.equals(
        Transformations.translation(
          parseFloat(x),
          parseFloat(y),
          parseFloat(z),
        ),
      ),
    ).to.be.true;
  },
);

Then(
  "{word} = scaling\\({float}, {float}, {float})",
  function (varName: string, x: number, y: number, z: number) {
    const transformationMatrix = getMatrix(this, varName);

    expect(transformationMatrix.equals(Transformations.scale(x, y, z))).to.be
      .true;
  },
);

Then(
  "transform * {word} = {word}",
  function (firstVarName: string, secondVarName: string) {
    expect(firstVarName).to.eql(secondVarName);

    const transformationMatrix = getMatrix(this, "transform");
    const tuple = getTuple(this, firstVarName);

    expect(transformationMatrix.multiply(tuple).equals(tuple)).to.be.true;
  },
);

Then(
  "{word} * {word} = point\\({float}, {float}, {float})",
  function (
    transformationVarName: string,
    varName: string,
    x: number,
    y: number,
    z: number,
  ) {
    const transformationMatrix = getMatrix(this, transformationVarName);
    const point = getPoint(this, varName);

    expect(transformationMatrix.multiply(point).equals(new Point(x, y, z))).to
      .be.true;
  },
);

Then(
  "{word} * {word} = vector\\({float}, {float}, {float})",
  function (
    transformationVarName: string,
    varName: string,
    x: number,
    y: number,
    z: number,
  ) {
    const transformationMatrix = getMatrix(this, transformationVarName);
    const vector = getVector(this, varName);

    expect(transformationMatrix.multiply(vector).equals(new Vector(x, y, z))).to
      .be.true;
  },
);
