import { Given, Then, When } from "@cucumber/cucumber";
import { Matrix, Sphere, Transformations } from "../src";
import { getMatrix, getSphere } from "./utils";
import { expect } from "chai";

Given("{word} ← sphere\\()", function (varName: string) {
  this[varName] = new Sphere();
});

When(
  "set_transform\\({word}, {word})",
  function (sphereVarName: string, matrixVarName: string) {
    const sphere = getSphere(this, sphereVarName);
    const matrix = getMatrix(this, matrixVarName);

    sphere.transform = matrix;
  }
);

When(
  "set_transform\\({word}, translation\\({float}, {float}, {float}))",
  function (sphereVarName: string, x: number, y: number, z: number) {
    const sphere = getSphere(this, sphereVarName);

    sphere.transform = Transformations.translation(x, y, z);
  }
);

When(
  "set_transform\\({word}, scaling\\({float}, {float}, {float}))",
  function (sphereVarName: string, x: number, y: number, z: number) {
    const sphere = getSphere(this, sphereVarName);

    sphere.transform = Transformations.scale(x, y, z);
  }
);

Then("{word}.transform = identity_matrix", function (varName: string) {
  const sphere = getSphere(this, varName);

  expect(sphere.transform.equals(Matrix.identity(4))).to.be.true;
});
