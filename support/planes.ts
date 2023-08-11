import { DataTable, Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";

import { Intersection, Plane, Point } from "../src";
import { customizeShapeWith, getArray, getPlane, getRay } from "./utils";

Given("{word} ← plane\\()", function (varName: string) {
  this[varName] = new Plane();
});

Given(
  "{word} ← plane\\() with:",
  function (varName: string, dataTable: DataTable) {
    this[varName] = customizeShapeWith(new Plane(), dataTable);
  },
);

Then("{word} is empty", function (varName: string) {
  const array = getArray(this, varName, Intersection);

  expect(array).to.be.empty;
});
