import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";

import {
  Checkers,
  Color,
  Gradient,
  Pattern,
  Point,
  Ring,
  Stripe,
  Transformations,
} from "../src";
import {
  getColor,
  getMaterial,
  getPattern,
  getShape,
  getStripe,
} from "./utils";

Given("{word} ← test_pattern\\()", function (varName: string) {
  this[varName] = new Pattern();
});

Given(
  "{word} ← stripe_pattern\\({word}, {word})",
  function (varName: string, firstColorName: string, secondColorName: string) {
    const firstColor = getColor(this, firstColorName);
    const secondColor = getColor(this, secondColorName);

    this[varName] = new Stripe(firstColor, secondColor);
  },
);

Given(
  "{word} ← gradient_pattern\\({word}, {word})",
  function (varName: string, firstColorName: string, secondColorName: string) {
    const firstColor = getColor(this, firstColorName);
    const secondColor = getColor(this, secondColorName);

    this[varName] = new Gradient(firstColor, secondColor);
  },
);

Given(
  "{word} ← ring_pattern\\({word}, {word})",
  function (varName: string, firstColorName: string, secondColorName: string) {
    const firstColor = getColor(this, firstColorName);
    const secondColor = getColor(this, secondColorName);

    this[varName] = new Ring(firstColor, secondColor);
  },
);

Given(
  "{word} ← checkers_pattern\\({word}, {word})",
  function (varName: string, firstColorName: string, secondColorName: string) {
    const firstColor = getColor(this, firstColorName);
    const secondColor = getColor(this, secondColorName);

    this[varName] = new Checkers(firstColor, secondColor);
  },
);

Given(
  "{word}.pattern ← stripe_pattern\\(color\\({float}, {float}, {float}), color\\({float}, {float}, {float}))",
  function (
    varName: string,
    ra: number,
    ga: number,
    ba: number,
    rb: number,
    gb: number,
    bb: number,
  ) {
    const material = getMaterial(this, varName);

    material.pattern = new Stripe(new Color(ra, ga, ba), new Color(rb, gb, bb));
  },
);

Given(
  "set_pattern_transform\\({word}, scaling\\({float}, {float}, {float}))",
  function (patternVarName: string, x: number, y: number, z: number) {
    const pattern = getPattern(this, patternVarName);

    pattern.transform = Transformations.scale(x, y, z);
  },
);

Given(
  "set_pattern_transform\\({word}, translation\\({float}, {float}, {float}))",
  function (patternVarName: string, x: number, y: number, z: number) {
    const pattern = getPattern(this, patternVarName);

    pattern.transform = Transformations.translation(x, y, z);
  },
);

When(
  "{word} ← stripe_at_object\\({word}, {word}, point\\({float}, {float}, {float}))",
  function (
    varName: string,
    patternVarName: string,
    shapeVarName: string,
    x: number,
    y: number,
    z: number,
  ) {
    const stripe = getStripe(this, patternVarName);
    const shape = getShape(this, shapeVarName);

    this[varName] = stripe.colorAt(new Point(x, y, z), shape);
  },
);

When(
  "{word} ← pattern_at_shape\\({word}, {word}, point\\({float}, {float}, {float}))",
  function (
    varName: string,
    patternVarName: string,
    shapeVarName: string,
    x: number,
    y: number,
    z: number,
  ) {
    const pattern = getPattern(this, patternVarName);
    const shape = getShape(this, shapeVarName);

    this[varName] = pattern.colorAt(new Point(x, y, z), shape);
  },
);

Then(
  "stripe_at\\({word}, point\\({float}, {float}, {float})) = {word}",
  function (
    varName: string,
    x: number,
    y: number,
    z: number,
    colorName: string,
  ) {
    const stripe = getStripe(this, varName);
    const color = getColor(this, colorName);
    const point = new Point(x, y, z);

    expect(stripe.colorAt(point).equals(color)).to.be.true;
  },
);

Then(
  "pattern_at\\({word}, point\\({float}, {float}, {float})) = {word}",
  function (
    varName: string,
    x: number,
    y: number,
    z: number,
    colorName: string,
  ) {
    const pattern = getPattern(this, varName);
    const color = getColor(this, colorName);
    const point = new Point(x, y, z);

    expect(pattern.colorAt(point).equals(color)).to.be.true;
  },
);

Then(
  "pattern_at\\({word}, point\\({float}, {float}, {float})) = color\\({float}, {float}, {float})",
  function (
    varName: string,
    x: number,
    y: number,
    z: number,
    r: number,
    g: number,
    b: number,
  ) {
    const pattern = getPattern(this, varName);
    const point = new Point(x, y, z);
    const color = new Color(r, g, b);

    expect(pattern.colorAt(point).equals(color)).to.be.true;
  },
);
