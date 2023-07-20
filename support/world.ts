import { Given, Then, When } from "@cucumber/cucumber";
import { getIntersection, getRay, getShape, getWorld } from "./utils";
import { expect } from "chai";
import { World } from "../src";

Given("{word} ← world\\()", function (varName: string) {
  this[varName] = new World();
});

Given(
  "{word} ← the first object in {word}",
  function (varName: string, worldVarName: string) {
    const world = getWorld(this, worldVarName);

    this[varName] = world.shapes[0];
  }
);

Given(
  "{word} ← the second object in {word}",
  function (varName: string, worldVarName: string) {
    const world = getWorld(this, worldVarName);

    this[varName] = world.shapes[1];
  }
);

When("{word} ← default_world\\()", function (varName: string) {
  this[varName] = World.default();
});

When(
  "{word} ← intersect_world\\({word}, {word})",
  function (varName: string, worldVarName: string, rayVarName: string) {
    const world = getWorld(this, worldVarName);
    const ray = getRay(this, rayVarName);

    this[varName] = world.intersect(ray);
  }
);

When(
  "{word} ← color_at\\({word}, {word})",
  function (varName: string, worldVarName: string, rayVarName: string) {
    const world = getWorld(this, worldVarName);
    const ray = getRay(this, rayVarName);

    this[varName] = world.colorAt(ray);
  }
);

When(
  "{word} ← prepare_computations\\({word}, {word})",
  function (varName: string, intersectionVarName: string, rayVarName: string) {
    const intersection = getIntersection(this, intersectionVarName);
    const ray = getRay(this, rayVarName);

    this[varName] = World.prepareComputations(intersection, ray);
  }
);

When(
  "{word} ← shade_hit\\({word}, {word})",
  function (
    varName: string,
    worldVarName: string,
    computationsVarName: string
  ) {
    const world = getWorld(this, worldVarName);

    this[varName] = world.shadeHit(this[computationsVarName]);
  }
);

Then("{word} contains no objects", function (varName: string) {
  const world = getWorld(this, varName);

  expect(world.shapes).to.be.an("array").that.is.empty;
});

Then("{word} has no light source", function (varName: string) {
  const world = getWorld(this, varName);

  expect(world.light).to.be.null;
});

Then(
  "{word} contains {word}",
  function (worldVarName: string, shapeVarName: string) {
    const world = getWorld(this, worldVarName);
    const shape = getShape(this, shapeVarName);

    expect(world.shapes.find((item) => item.equals(shape))).to.be.not.undefined;
  }
);
