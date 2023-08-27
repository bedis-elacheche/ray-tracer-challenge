import { DataTable, Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";

import { Point, Shape, Transformations } from "../src";
import {
  customizeShapeWith,
  getIntersection,
  getMatrix,
  getPoint,
  getRay,
  getShape,
} from "./utils";

Given("{word} ← test_shape\\()", function (varName: string) {
  this[varName] = new Shape();
});

Given("{word} has:", function (varName: string, dataTable: DataTable) {
  const shape = getShape(this, varName);

  customizeShapeWith(shape, dataTable);
});

When(
  "{word} ← local_normal_at\\({word}, {word})",
  function (varName: string, shapeName: string, pointName: string) {
    const shape = getShape(this, shapeName);
    const point = getPoint(this, pointName);

    this[varName] = shape.localNormalAt(point);
  },
);

When(
  "{word} ← local_normal_at\\({word}, point\\({float}, {float}, {float}))",
  function (
    varName: string,
    shapeName: string,
    x: number,
    y: number,
    z: number,
  ) {
    const shape = getShape(this, shapeName);

    this[varName] = shape.localNormalAt(new Point(x, y, z));
  },
);

When(
  "{word} ← local_intersect\\({word}, {word})",
  function (varName: string, itemName: string, rayName: string) {
    const ray = getRay(this, rayName);

    this[varName] = this[itemName].localIntersect(ray);
  },
);

When(
  "set_transform\\({word}, {word})",
  function (varName: string, matrixVarName: string) {
    const matrix = getMatrix(this, matrixVarName);

    this[varName].transform = matrix;
  },
);

When(
  "set_transform\\({word}, rotation_y\\(π \\/ {float}))",
  function (varName: string, divisor: number) {
    this[varName].transform = Transformations.rotateY(Math.PI / divisor);
  },
);

When(
  "set_transform\\({word}, translation\\({float}, {float}, {float}))",
  function (varName: string, x: number, y: number, z: number) {
    this[varName].transform = Transformations.translation(x, y, z);
  },
);

When(
  "set_transform\\({word}, scaling\\({float}, {float}, {float}))",
  function (varName: string, x: number, y: number, z: number) {
    this[varName].transform = Transformations.scale(x, y, z);
  },
);

When(
  "{word} ← normal_at\\({word}, point\\({float}, {float}, {float}))",
  function (
    normalVarName: string,
    shapeVarName: string,
    x: number,
    y: number,
    z: number,
  ) {
    const shape = getShape(this, shapeVarName);

    this[normalVarName] = shape.normalAt(new Point(x, y, z));
  },
);

When(
  "{word} ← normal_at\\({word}, point\\({float}, {float}, {float}), {word})",
  function (
    normalVarName: string,
    shapeVarName: string,
    x: number,
    y: number,
    z: number,
    intersectionVarName: string,
  ) {
    const shape = getShape(this, shapeVarName);
    const intersection = getIntersection(this, intersectionVarName);

    this[normalVarName] = shape.normalAt(new Point(x, y, z), intersection);
  },
);

Then(
  "{word}.transform = translation\\({float}, {float}, {float})",
  function (shapeVarName: string, x: number, y: number, z: number) {
    expect(
      this[shapeVarName].transform.equals(Transformations.translation(x, y, z)),
    ).to.be.true;
  },
);
