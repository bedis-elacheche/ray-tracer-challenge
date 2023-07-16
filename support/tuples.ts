import { expect } from "chai";
import { Given, Then, When } from "@cucumber/cucumber";
import { Color, EPSILON, Point, Tuple, Vector } from "../src";
import { float, getColor, getTuple, getVector, lowercase } from "./utils";

Given(
  "{word} ← tuple\\({float}, {float}, {float}, {float})",
  function (varName: string, x: number, y: number, z: number, w: number) {
    this[varName] = new Tuple(x, y, z, w);
  }
);

Given(
  "{word} ← point\\({float}, {float}, {float})",
  function (varName: string, x: number, y: number, z: number) {
    this[varName] = new Point(x, y, z);
  }
);

Given(
  "{word} ← color\\({float}, {float}, {float})",
  function (varName: string, r: number, g: number, b: number) {
    this[varName] = new Color(r, g, b);
  }
);

Given(
  "{word} ← vector\\({float}, {float}, {float})",
  function (varName: string, x: number, y: number, z: number) {
    this[varName] = new Vector(x, y, z);
  }
);

When(
  "{word} ← normalize\\({word})",
  function (firstVarName: string, secondVarName: string) {
    const second = getVector(this, secondVarName);

    this[firstVarName] = second.normalize();
  }
);

When(
  "{word} ← reflect\\({word}, {word})",
  function (firstVarName: string, secondVarName: string, thirdVarName: string) {
    const second = getVector(this, secondVarName);
    const third = getVector(this, thirdVarName);

    this[firstVarName] = second.reflect(third);
  }
);

Then("{word} is a point", function (varName: string) {
  const tuple = getTuple(this, varName);

  expect(Point.isPoint(tuple)).to.be.true;
});

Then("{word} is not a point", function (varName: string) {
  const tuple = getTuple(this, varName);

  expect(Point.isPoint(tuple)).to.be.false;
});

Then("{word} is a vector", function (varName: string) {
  const tuple = getTuple(this, varName);

  expect(Vector.isVector(tuple)).to.be.true;
});

Then("{word} is not a vector", function (varName: string) {
  const tuple = getTuple(this, varName);

  expect(Vector.isVector(tuple)).to.be.false;
});

Then(
  "{word} = tuple\\({float}, {float}, {float}, {float})",
  function (varName: string, x: number, y: number, z: number, w: number) {
    const tuple = varName.startsWith("-")
      ? getTuple(this, varName.slice(1)).negate()
      : getTuple(this, varName);

    expect(tuple.equals(new Tuple(x, y, z, w))).to.be.true;
  }
);

Then(
  "{word} + {word} = tuple\\({float}, {float}, {float}, {float})",
  function (
    firstVarName: string,
    secondVarName: string,
    x: number,
    y: number,
    z: number,
    w: number
  ) {
    const first = getTuple(this, firstVarName);
    const second = getTuple(this, secondVarName);

    expect(first.add(second).equals(new Tuple(x, y, z, w))).to.be.true;
  }
);

Then(
  "{word} - {word} = point\\({float}, {float}, {float})",
  function (
    firstVarName: string,
    secondVarName: string,
    x: number,
    y: number,
    z: number
  ) {
    const first = getTuple(this, firstVarName);
    const second = getTuple(this, secondVarName);

    expect(first.subtract(second).equals(new Point(x, y, z))).to.be.true;
  }
);

Then(
  "{word} - {word} = vector\\({float}, {float}, {float})",
  function (
    firstVarName: string,
    secondVarName: string,
    x: number,
    y: number,
    z: number
  ) {
    const first = getTuple(this, firstVarName);
    const second = getTuple(this, secondVarName);

    expect(first.subtract(second).equals(new Vector(x, y, z))).to.be.true;
  }
);

Then(
  "{word} * {float} = tuple\\({float}, {float}, {float}, {float})",
  function (
    varName: string,
    scalar: number,
    x: number,
    y: number,
    z: number,
    w: number
  ) {
    const tuple = getTuple(this, varName);

    expect(tuple.multiply(scalar).equals(new Tuple(x, y, z, w))).to.be.true;
  }
);

Then(
  "{word} \\/ {float} = tuple\\({float}, {float}, {float}, {float})",
  function (
    varName: string,
    scalar: number,
    x: number,
    y: number,
    z: number,
    w: number
  ) {
    const tuple = getTuple(this, varName);

    expect(tuple.divide(scalar).equals(new Tuple(x, y, z, w))).to.be.true;
  }
);

Then(
  "magnitude\\({word}) = {float}",
  function (varName: string, magnitude: number) {
    const vector = getVector(this, varName);

    expect(vector.magnitude()).to.eql(magnitude);
  }
);

Then(
  "magnitude\\({word}) = √{float}",
  function (varName: string, magnitude: number) {
    const vector = getVector(this, varName);

    expect(vector.magnitude() - Math.sqrt(magnitude)).to.be.lessThanOrEqual(
      EPSILON
    );
  }
);

Then(
  "dot\\({word}, {word}) = {float}",
  function (firstVarName: string, secondVarName: string, dotProduct: number) {
    const first = getVector(this, firstVarName);
    const second = getVector(this, secondVarName);

    expect(first.dot(second)).to.eql(dotProduct);
  }
);

Then(
  "cross\\({word}, {word}) = vector\\({float}, {float}, {float})",
  function (
    firstVarName: string,
    secondVarName: string,
    x: number,
    y: number,
    z: number
  ) {
    const first = getVector(this, firstVarName);
    const second = getVector(this, secondVarName);

    expect(first.cross(second).equals(new Vector(x, y, z))).to.be.true;
  }
);

Then(
  "normalize\\({word}) = vector\\({float}, {float}, {float})",
  function (varName: string, x: number, y: number, z: number) {
    const vector = getVector(this, varName);

    expect(vector.normalize().equals(new Vector(x, y, z))).to.be.true;
  }
);

Then(
  "{word} = normalize\\({word})",
  function (firstVarName: string, secondVarName: string) {
    const first = getVector(this, firstVarName);
    const second = getVector(this, secondVarName);

    expect(first.equals(second.normalize())).to.be.true;
  }
);

Then(
  "normalize\\({word}) = approximately vector\\({float}, {float}, {float})",
  function (varName: string, x: number, y: number, z: number) {
    const vector = getVector(this, varName);

    expect(vector.normalize().equals(new Vector(x, y, z))).to.be.true;
  }
);

Then(
  "{word} + {word} = color\\({float}, {float}, {float})",
  function (
    firstVarName: string,
    secondVarName: string,
    r: number,
    g: number,
    b: number
  ) {
    const first = getColor(this, firstVarName);
    const second = getColor(this, secondVarName);

    expect(first.add(second).equals(new Color(r, g, b))).to.be.true;
  }
);

Then(
  "{word} - {word} = color\\({float}, {float}, {float})",
  function (
    firstVarName: string,
    secondVarName: string,
    r: number,
    g: number,
    b: number
  ) {
    const first = getColor(this, firstVarName);
    const second = getColor(this, secondVarName);

    expect(first.subtract(second).equals(new Color(r, g, b))).to.be.true;
  }
);

Then(
  "{word} * {word} = color\\({float}, {float}, {float})",
  function (
    firstVarName: string,
    secondVar: string,
    r: number,
    g: number,
    b: number
  ) {
    const first = getColor(this, firstVarName);
    const scalar = parseFloat(secondVar);
    const second = isNaN(scalar) ? getColor(this, secondVar) : scalar;

    expect(first.multiply(second).equals(new Color(r, g, b))).to.be.true;
  }
);
