import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";

import { Point, Shape, Transformations } from "../src";
import { getMatrix, getShape } from "./utils";

Given("{word} ← test_shape\\()", function (varName: string) {
  this[varName] = new Shape();
});

When(
  "set_transform\\({word}, {word})",
  function (shapeVarName: string, matrixVarName: string) {
    const shape = getShape(this, shapeVarName);
    const matrix = getMatrix(this, matrixVarName);

    shape.transform = matrix;
  },
);

When(
  "set_transform\\({word}, translation\\({float}, {float}, {float}))",
  function (shapeVarName: string, x: number, y: number, z: number) {
    const shape = getShape(this, shapeVarName);

    shape.transform = Transformations.translation(x, y, z);
  },
);

When(
  "set_transform\\({word}, scaling\\({float}, {float}, {float}))",
  function (shapeVarName: string, x: number, y: number, z: number) {
    const shape = getShape(this, shapeVarName);

    shape.transform = Transformations.scale(x, y, z);
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

Then(
  "{word}.transform = translation\\({float}, {float}, {float})",
  function (shapeVarName: string, x: number, y: number, z: number) {
    expect(
      this[shapeVarName].transform.equals(Transformations.translation(x, y, z)),
    ).to.be.true;
  },
);
