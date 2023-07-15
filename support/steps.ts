import { Then } from "@cucumber/cucumber";
import { expect } from "chai";
import { float, getTuple, int, lowercase } from "./utils";
import { Point, Vector } from "../src";

Then(
  new RegExp(`^${lowercase.source}.${lowercase.source} = ${float.source}$`),
  function (varName: string, key: string, value: string) {
    expect(this[varName][key === "count" ? "length" : key]).to.eq(
      parseFloat(value)
    );
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
    `^${lowercase.source}\\[${int.source}\\].${lowercase.source} = ${float.source}$`
  ),
  function (varName: string, index: string, key: string, value: string) {
    expect(this[varName]).to.be.an("array");
    expect(this[varName][index][key]).to.eq(parseFloat(value));
  }
);

Then(
  new RegExp(
    `^${lowercase.source}\\[${int.source}\\].${lowercase.source} = ${lowercase.source}$`
  ),
  function (varName: string, index: string, key: string, value: string) {
    expect(this[varName]).to.be.an("array");
    expect(this[varName][index][key].equals(this[value])).to.be.true;
  }
);

Then(
  new RegExp(`^${lowercase.source}.${lowercase.source} = ${lowercase.source}$`),
  function (varName: string, key: string, value: string) {
    expect(this[varName][key].equals(this[value])).to.be.true;
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
    `^${lowercase.source}.${lowercase.source} = (point|vector)\\(${float.source}, ${float.source}, ${float.source}\\)$`
  ),
  function (
    varName: string,
    key: string,
    instanceType: string,
    x: string,
    y: string,
    z: string
  ) {
    const parsed = [x, y, z].map(parseFloat) as [number, number, number];
    const second =
      instanceType === "point" ? new Point(...parsed) : new Vector(...parsed);

    expect(this[varName][key].equals(second)).to.be.true;
  }
);

Then("{word} is nothing", function (varName: string) {
  expect(this[varName]).to.be.null;
});