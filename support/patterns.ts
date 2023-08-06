import { Given, Then, When } from "@cucumber/cucumber";
import { getColor, getMaterial, getShape, getStripe } from "./utils";
import { Color, Point, Stripe, Transformations } from "../src";
import { expect } from "chai";

Given(
  "{word} ← stripe_pattern\\({word}, {word})",
  function (varName: string, firstColorName: string, secondColorName: string) {
    const firstColor = getColor(this, firstColorName);
    const secondColor = getColor(this, secondColorName);

    this[varName] = new Stripe(firstColor, secondColor);
  }
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
    bb: number
  ) {
    const material = getMaterial(this, varName);

    material.pattern = new Stripe(new Color(ra, ga, ba), new Color(rb, gb, bb));
  }
);

Given(
  "set_pattern_transform\\({word}, scaling\\({float}, {float}, {float}))",
  function (patternVarName: string, x: number, y: number, z: number) {
    const stripe = getStripe(this, patternVarName);

    stripe.transform = Transformations.scale(x, y, z);
  }
);

Given(
  "set_pattern_transform\\({word}, translation\\({float}, {float}, {float}))",
  function (patternVarName: string, x: number, y: number, z: number) {
    const stripe = getStripe(this, patternVarName);

    stripe.transform = Transformations.translation(x, y, z);
  }
);

When(
  "{word} ← stripe_at_object\\({word}, {word}, point\\({float}, {float}, {float}))",
  function (
    varName: string,
    patternVarName: string,
    shapeVarName: string,
    x: number,
    y: number,
    z: number
  ) {
    const stripe = getStripe(this, patternVarName);
    const shape = getShape(this, shapeVarName);

    this[varName] = stripe.colorAt(new Point(x, y, z), shape);
  }
);

Then(
  "stripe_at\\({word}, point\\({float}, {float}, {float})) = {word}",
  function (
    varName: string,
    x: number,
    y: number,
    z: number,
    colorName: string
  ) {
    const stripe = getStripe(this, varName);
    const color = getColor(this, colorName);
    const point = new Point(x, y, z);

    expect(stripe.colorAt(point).equals(color)).to.be.true;
  }
);
