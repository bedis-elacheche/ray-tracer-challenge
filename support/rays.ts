import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";

import { Point, Ray, Vector } from "../src";
import { getPoint, getRay, getVector } from "./utils";

Given(
  "{word} ← ray\\(point\\({float}, {float}, {float}), vector\\({float}, {float}, {float}))",
  function (
    varName: string,
    px: number,
    py: number,
    pz: number,
    vx: number,
    vy: number,
    vz: number,
  ) {
    const point = new Point(px, py, pz);
    const vector = new Vector(vx, vy, vz);

    this[varName] = new Ray(point, vector);
  },
);

Given(
  "{word} ← ray\\(point\\({float}, {float}, {float}), {word})",
  function (
    varName: string,
    px: number,
    py: number,
    pz: number,
    vectorVarName: string,
  ) {
    const point = new Point(px, py, pz);
    const vector = getVector(this, vectorVarName);

    this[varName] = new Ray(point, vector);
  },
);

When(
  "{word} ← ray\\({word}, {word})",
  function (rayVarName: string, pointVarName: string, vectorVarName: string) {
    const point = getPoint(this, pointVarName);
    const vector = getVector(this, vectorVarName);

    this[rayVarName] = new Ray(point, vector);
  },
);

When(
  "{word} ← intersect\\({word}, {word})",
  function (varName: string, shapeOrGroupVarName: string, rayVarName: string) {
    const ray = getRay(this, rayVarName);

    this[varName] = this[shapeOrGroupVarName].intersect(ray);
  },
);

Then(
  "position\\({word}, {float}) = point\\({float}, {float}, {float})",
  function (varName: string, t: number, x: number, y: number, z: number) {
    const ray = getRay(this, varName);

    expect(ray.position(t).equals(new Point(x, y, z)));
  },
);
