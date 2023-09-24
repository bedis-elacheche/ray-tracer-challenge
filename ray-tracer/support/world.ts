import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";

import { Group, Intersection, PointLight, Shape, World } from "../src";
import {
  getArray,
  getIntersection,
  getPoint,
  getPointLight,
  getRay,
  getShapeOrGroup,
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

    this[varName] = world.children[0];
  },
);

Given(
  "{word} ← the second object in {word}",
  function (varName: string, worldVarName: string) {
    const world = getWorld(this, worldVarName);

    this[varName] = world.children[1];
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
    const intersections = getArray(
      this,
      intersectionsVarName,
      Intersection<Shape>,
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
    const intersections = getArray(
      this,
      intersectionsVarName,
      Intersection<Shape>,
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

  expect(world.children).to.be.an("array").that.is.empty;
});

Then("{word} has no light source", function (varName: string) {
  const world = getWorld(this, varName);

  expect(world.lights).to.be.an("array").that.is.empty;
});

Then(
  "{word} contains {word}",
  function (worldVarName: string, varName: string) {
    const world = getWorld(this, worldVarName);
    const item = getShapeOrGroup(this, varName);

    expect(
      world.children.find((child) => {
        if (child instanceof Group && item instanceof Group) {
          return child.equals(item);
        }

        if (child instanceof Shape && item instanceof Shape) {
          return child.equals(item);
        }

        return false;
      }),
    ).to.be.not.undefined;
  },
);

Then(
  "is_shadowed\\({word}, {word}) is {word}",
  function (worldVarName: string, pointVarName: string, value: string) {
    const world = getWorld(this, worldVarName);
    const point = getPoint(this, pointVarName);

    expect(
      world.isShadowed(point, (world.lights[0] as PointLight).position),
    ).to.eq(value === "true");
  },
);

Then(
  "is_shadowed\\({word}, {word}, {word}) is {word}",
  function (
    worldVarName: string,
    lightPositionVarName: string,
    pointVarName: string,
    value: string,
  ) {
    const world = getWorld(this, worldVarName);
    const lightPosition = getPoint(this, lightPositionVarName);
    const point = getPoint(this, pointVarName);

    expect(world.isShadowed(lightPosition, point)).to.eq(value === "true");
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

Then(
  "{word}.lights[{int}] = {word}",
  function (worldVarName: string, index: number, lightVarName: string) {
    const world = getWorld(this, worldVarName);
    const light = getPointLight(this, lightVarName);

    expect(world.lights[index - 1].equals(light)).to.be.true;
  },
);
