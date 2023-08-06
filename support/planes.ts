import { Given, Then, When } from "@cucumber/cucumber";
import { Intersection, Plane, Point } from "../src";
import { getArray, getPlane, getRay } from "./utils";
import { expect } from "chai";

Given("{word} ← plane\\()", function (varName: string) {
  this[varName] = new Plane();
});

When(
  "{word} ← local_normal_at\\({word}, point\\({float}, {float}, {float}))",
  function (
    varName: string,
    planeName: string,
    x: number,
    y: number,
    z: number
  ) {
    const plane = getPlane(this, planeName);

    this[varName] = plane.normalAt(new Point(x, y, z));
  }
);

When(
  "{word} ← local_intersect\\({word}, {word})",
  function (varName: string, planeName: string, rayName: string) {
    const plane = getPlane(this, planeName);
    const ray = getRay(this, rayName);

    this[varName] = plane.localIntersect(ray);
  }
);

Then("{word} is empty", function (varName: string) {
  const array = getArray(this, varName, Intersection);

  expect(array).to.be.empty;
});