import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";

import { BoundingBox, Point } from "../src";
import {
  getBoundingBox,
  getPoint,
  getRay,
  getShape,
  getShapeOrGroupOrCSG,
} from "./utils";

Given("{word} ← bounding_box\\(empty)", function (varName: string) {
  this[varName] = new BoundingBox();
});

Given(
  "{word} ← bounding_box\\(min=point\\({float}, {float}, {float}) max=point\\({float}, {float}, {float}))",
  function (
    varName: string,
    minX: number,
    minY: number,
    minZ: number,
    maxX: number,
    maxY: number,
    maxZ: number,
  ) {
    this[varName] = new BoundingBox({
      min: new Point(minX, minY, minZ),
      max: new Point(maxX, maxY, maxZ),
    });
  },
);

When(
  "{word} ← bounds_of\\({word})",
  function (varName: string, itemVarName: string) {
    const item = getShapeOrGroupOrCSG(this, itemVarName);

    this[varName] = item.bounds;
  },
);

When(
  "{word} ← parent_space_bounds_of\\({word})",
  function (varName: string, shapeVarName: string) {
    const shape = getShape(this, shapeVarName);

    this[varName] = shape.parentSpaceBounds;
  },
);

When(
  "\\({word}, {word}) ← split_bounds\\({word})",
  function (
    firstHalfVarName: string,
    secondHalfVarName: string,
    boxVarName: string,
  ) {
    const box = getBoundingBox(this, boxVarName);
    const [left, right] = box.split();

    this[firstHalfVarName] = left;
    this[secondHalfVarName] = right;
  },
);

Then(
  "box_contains_point\\({word}, {word}) is {word}",
  function (varName: string, pointVarName: string, bool: string) {
    const box = getBoundingBox(this, varName);
    const point = getPoint(this, pointVarName);
    const condtion = bool === "true";

    expect(box.contains(point)).to.equal(condtion);
  },
);

Then(
  "box_contains_box\\({word}, {word}) is {word}",
  function (varName: string, secondVarName: string, bool: string) {
    const box = getBoundingBox(this, varName);
    const second = getBoundingBox(this, secondVarName);
    const condtion = bool === "true";

    expect(box.contains(second)).to.equal(condtion);
  },
);

Then(
  "intersects\\({word}, {word}) is {word}",
  function (boxVarName: string, rayVarName: string, bool: string) {
    const box = getBoundingBox(this, boxVarName);
    const ray = getRay(this, rayVarName);
    const didIntersect = box.intersect(ray);

    expect(didIntersect).to.equal(bool === "true");
  },
);
