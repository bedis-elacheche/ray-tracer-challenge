import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";
import { float, getTuple, int, lowercase, mapKey, mapValue } from "./utils";
import { Color, Matrix, Point, Vector } from "../src";

Given(
  new RegExp(`^${lowercase.source}.${lowercase.source} ← ${float.source}$`),
  function (firstVarName: string, key: string, value: string) {
    this[firstVarName][key] = parseFloat(value);
  }
);

When(
  new RegExp(
    `^${lowercase.source}\\.${lowercase.source} ← ${lowercase.source}$`
  ),
  function (firstVarName: string, key: string, secondVarName: string) {
    this[firstVarName][key] = this[secondVarName];
  }
);

When(
  new RegExp(`^${lowercase.source} ← ${lowercase.source}.${lowercase.source}$`),
  function (firstVarName: string, secondVarName: string, key: string) {
    this[firstVarName] = this[secondVarName][key];
  }
);

Then(
  new RegExp(`^${lowercase.source}\\.${lowercase.source} = ${float.source}$`),
  function (varName: string, key: string, value: string) {
    expect(this[varName][mapKey(key)]).to.eq(parseFloat(value));
  }
);

Then(
  new RegExp(`^${lowercase.source}\\[${int.source}\\] = ${float.source}$`),
  function (varName: string, index: string, value: string) {
    expect(this[varName]).to.be.an("array");
    expect(this[varName][index]).to.eq(parseFloat(value));
  }
);

Then(
  new RegExp(
    `^${lowercase.source}\\[${int.source}\\]\\.${lowercase.source} = ${float.source}$`
  ),
  function (varName: string, index: string, key: string, value: string) {
    expect(this[varName]).to.be.an("array");
    expect(this[varName][index][key]).to.eq(parseFloat(value));
  }
);

Then(
  new RegExp(
    `^${lowercase.source}\\[${int.source}\\]\\.${lowercase.source} = ${lowercase.source}$`
  ),
  function (varName: string, index: string, key: string, value: string) {
    expect(this[varName]).to.be.an("array");
    expect(this[varName][index][key].equals(this[value])).to.be.true;
  }
);

Then(
  new RegExp(`^${lowercase.source}.${lowercase.source} = ${lowercase.source}$`),
  function (varName: string, key: string, value: string) {
    expect(this[varName][key].equals(mapValue(this, value))).to.be.true;
  }
);

Then(
  new RegExp(`^${lowercase.source} = ${lowercase.source}$`),
  function (firstVarName: string, secondVarName: string) {
    const first = this[firstVarName];
    const second = this[secondVarName];

    expect(first.equals(second)).to.be.true;
  }
);

Then(
  new RegExp(
    `^${lowercase.source} = (point|vector|color)\\(${float.source}, ${float.source}, ${float.source}\\)$`
  ),
  function (
    varName: string,
    instanceType: "point" | "vector" | "color",
    x: string,
    y: string,
    z: string
  ) {
    const parsed = [x, y, z].map(parseFloat) as [number, number, number];

    switch (instanceType) {
      case "point":
        expect(this[varName].equals(new Point(...parsed))).to.be.true;
        break;
      case "color":
        expect(this[varName].equals(new Color(...parsed))).to.be.true;
        break;
      case "vector":
        expect(this[varName].equals(new Vector(...parsed))).to.be.true;
    }
  }
);

Then(
  new RegExp(
    `^${lowercase.source}\\.${lowercase.source} = (point|vector|color)\\(${float.source}, ${float.source}, ${float.source}\\)$`
  ),
  function (
    varName: string,
    key: string,
    instanceType: "point" | "vector" | "color",
    x: string,
    y: string,
    z: string
  ) {
    const parsed = [x, y, z].map(parseFloat) as [number, number, number];

    switch (instanceType) {
      case "point":
        expect(this[varName][key].equals(new Point(...parsed))).to.be.true;
        break;
      case "color":
        expect(this[varName][key].equals(new Color(...parsed))).to.be.true;
        break;
      case "vector":
        expect(this[varName][key].equals(new Vector(...parsed))).to.be.true;
    }
  }
);

Then("{word} is nothing", function (varName: string) {
  expect(this[varName]).to.be.null;
});
