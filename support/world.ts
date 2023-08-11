import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";

import { Intersection, World } from "../src";
import {
  getArray,
  getIntersection,
  getPoint,
  getRay,
  getShape,
  getWorld,
  int,
  lowercase,
} from "./utils";

Given("{word} ← world\\()", function (varName: string) {
  this[varName] = new World();
});

Given(
  "{word} ← the first object in {word}",
  function (varName: string, worldVarName: string) {
    const world = getWorld(this, worldVarName);

    this[varName] = world.shapes[0];
  },
);

Given(
  "{word} ← the second object in {word}",
  function (varName: string, worldVarName: string) {
    const world = getWorld(this, worldVarName);

    this[varName] = world.shapes[1];
  },
);

Given(
  "{word} is added to {word}",
  function (varName: string, worldVarName: string) {
    const world = getWorld(this, worldVarName);
    const shape = getShape(this, varName);

    world.shapes.push(shape);
  },
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
  },
);

When(
  "{word} ← color_at\\({word}, {word})",
  function (varName: string, worldVarName: string, rayVarName: string) {
    const world = getWorld(this, worldVarName);
    const ray = getRay(this, rayVarName);

    this[varName] = world.colorAt(ray);
  },
);

When(
  new RegExp(
    `^${lowercase.source} ← prepare_computations\\(${lowercase.source}, ${lowercase.source}\\)$`,
  ),
  function (varName: string, intersectionVarName: string, rayVarName: string) {
    const intersection = getIntersection(this, intersectionVarName);
    const ray = getRay(this, rayVarName);

    this[varName] = World.prepareComputations(intersection, ray, [
      intersection,
    ]);
  },
);

When(
  new RegExp(
    `^${lowercase.source} ← prepare_computations\\(${lowercase.source}, ${lowercase.source}, ${lowercase.source}\\)$`,
  ),
  function (
    varName: string,
    intersectionVarName: string,
    rayVarName: string,
    intersectionsVarName: string,
  ) {
    const intersection = getIntersection(this, intersectionVarName);
    const intersections = getArray<Intersection>(
      this,
      intersectionsVarName,
      Intersection,
    );
    const ray = getRay(this, rayVarName);

    this[varName] = World.prepareComputations(intersection, ray, intersections);
  },
);

When(
  new RegExp(
    `^${lowercase.source} ← prepare_computations\\(${lowercase.source}\\[${int.source}\\], ${lowercase.source}, ${lowercase.source}\\)$`,
  ),
  function (
    varName: string,
    intersectionsVarName: string,
    index: number,
    rayVarName: string,
    _intersectionsVarNameAgain: string,
  ) {
    const intersections = getArray<Intersection>(
      this,
      intersectionsVarName,
      Intersection,
    );
    const ray = getRay(this, rayVarName);

    this[varName] = World.prepareComputations(
      intersections[index],
      ray,
      intersections,
    );
  },
);

When(
  "{word} ← shade_hit\\({word}, {word}, {int})",
  function (
    varName: string,
    worldVarName: string,
    computationsVarName: string,
    remaining: number,
  ) {
    const world = getWorld(this, worldVarName);

    this[varName] = world.shadeHit(this[computationsVarName], remaining);
  },
);

When(
  "{word} ← schlick\\({word})",
  function (varName: string, computationsVarName: string) {
    this[varName] = World.shlick(this[computationsVarName]);
  },
);

When(
  "{word} ← shade_hit\\({word}, {word})",
  function (
    varName: string,
    worldVarName: string,
    computationsVarName: string,
  ) {
    const world = getWorld(this, worldVarName);

    this[varName] = world.shadeHit(this[computationsVarName]);
  },
);

When(
  "{word} ← reflected_color\\({word}, {word})",
  function (
    colorVarName: string,
    worldVarName: string,
    computationsVarName: string,
  ) {
    const world = getWorld(this, worldVarName);

    this[colorVarName] = world.reflectedColor(this[computationsVarName]);
  },
);

When(
  "{word} ← reflected_color\\({word}, {word}, {float})",
  function (
    colorVarName: string,
    worldVarName: string,
    computationsVarName: string,
    remaining: number,
  ) {
    const world = getWorld(this, worldVarName);

    this[colorVarName] = world.reflectedColor(
      this[computationsVarName],
      remaining,
    );
  },
);

When(
  "{word} ← refracted_color\\({word}, {word}, {float})",
  function (
    colorVarName: string,
    worldVarName: string,
    computationsVarName: string,
    remaining: number,
  ) {
    const world = getWorld(this, worldVarName);

    this[colorVarName] = world.refractedColor(
      this[computationsVarName],
      remaining,
    );
  },
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
  },
);

Then(
  "is_shadowed\\({word}, {word}) is {word}",
  function (worldVarName: string, pointVarName: string, value: string) {
    const world = getWorld(this, worldVarName);
    const point = getPoint(this, pointVarName);

    expect(world.isShadowed(point)).to.eq(value === "true");
  },
);

Then(
  "color_at\\({word}, {word}) should terminate successfully",
  function (worldVarName: string, rayVarName: string) {
    const world = getWorld(this, worldVarName);
    const ray = getRay(this, rayVarName);

    expect(() => world.colorAt(ray)).not.to.throw(
      RangeError,
      "Maximum call stack size exceeded",
    );
  },
);