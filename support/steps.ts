import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";

import { Color, EPSILON, Point, Vector } from "../src";
import { float, int, lowercase, mapKey, mapValue } from "./utils";

Given(
  new RegExp(`^${lowercase.source} ← ${float.source}$`),
  function (varName: string, value: string) {
    this[varName] = parseFloat(value);
  },
);

Given(
  new RegExp(`^${lowercase.source} ← ${lowercase.source}$`),
  function (varName: string, secondVarName: string) {
    this[varName] = mapValue(this, secondVarName);
  },
);

Given(
  new RegExp(`^${lowercase.source}\\.${lowercase.source} ← ${float.source}$`),
  function (firstVarName: string, key: string, value: string) {
    this[firstVarName][key] = parseFloat(value);
  },
);

Given(
  new RegExp(
    `^${lowercase.source}\\.${lowercase.source}\\.${lowercase.source} ← ${float.source}$`,
  ),
  function (firstVarName: string, key: string, subKey: string, value: string) {
    this[firstVarName][key][subKey] = parseFloat(value);
  },
);

When(
  new RegExp(
    `^${lowercase.source}\\.${lowercase.source} ← ${lowercase.source}$`,
  ),
  function (firstVarName: string, key: string, secondVarName: string) {
    this[firstVarName][key] = mapValue(this, secondVarName);
  },
);

When(
  new RegExp(
    `^${lowercase.source} ← ${lowercase.source}\\.${lowercase.source}$`,
  ),
  function (firstVarName: string, secondVarName: string, key: string) {
    this[firstVarName] = this[secondVarName][key];
  },
);

Then(
  new RegExp(`^${lowercase.source} = ${float.source}$`),
  function (varName: string, value: string) {
    const variable = this[varName];

    expect(Math.abs(variable - parseFloat(value))).to.be.lessThanOrEqual(
      EPSILON,
    );
  },
);

Then(
  new RegExp(`^${lowercase.source}\\.${lowercase.source} = ${float.source}$`),
  function (varName: string, key: string, value: string) {
    const variable = this[varName];

    if (Array.isArray(variable) && key === "count") {
      expect(variable).to.have.length(parseInt(value, 10));
    } else {
      expect(
        Math.abs(variable[mapKey(key)] - parseFloat(value)),
      ).to.be.lessThanOrEqual(EPSILON);
    }
  },
);

Then(
  new RegExp(`^${lowercase.source}\\[${int.source}\\] = ${float.source}$`),
  function (varName: string, index: string, value: string) {
    expect(this[varName]).to.be.an("array");
    expect(
      Math.abs(this[varName][index] - parseFloat(value)),
    ).to.be.lessThanOrEqual(EPSILON);
  },
);

Then(
  new RegExp(
    `^${lowercase.source}\\[${int.source}\\]\\.${lowercase.source} = ${float.source}$`,
  ),
  function (varName: string, index: string, key: string, value: string) {
    expect(this[varName]).to.be.an("array");
    expect(
      Math.abs(this[varName][index][key] - parseFloat(value)),
    ).to.be.lessThanOrEqual(EPSILON);
  },
);

Then(
  new RegExp(
    `^${lowercase.source}\\.${lowercase.source}\\.${lowercase.source} = ${float.source}$`,
  ),
  function (varName: string, key: string, subKey: string, value: string) {
    expect(
      Math.abs(
        parseFloat(this[varName][mapKey(key)][mapKey(subKey)]) -
          parseFloat(value),
      ),
    ).to.be.lessThanOrEqual(EPSILON);
  },
);

Then(
  new RegExp(
    `^${lowercase.source}\\[${int.source}\\]\\.${lowercase.source} = ${lowercase.source}$`,
  ),
  function (varName: string, index: string, key: string, value: string) {
    expect(this[varName]).to.be.an("array");
    expect(this[varName][index][key].equals(this[value])).to.be.true;
  },
);

Then(
  new RegExp(
    `^${lowercase.source} = ${lowercase.source}\\.${lowercase.source}\\.${lowercase.source}$`,
  ),
  function (
    firstVarName: string,
    secondVarName: string,
    key: string,
    subKey: string,
  ) {
    const first = this[firstVarName];
    const second = this[secondVarName][key][subKey];

    if (typeof first !== "object" && typeof second !== "object") {
      expect(first).to.eql(second);
    } else {
      expect(first.equals(second)).to.be.true;
    }
  },
);

Then(
  new RegExp(
    `^${lowercase.source}\\.${lowercase.source} = -${lowercase.source}$`,
  ),
  function (varName: string, key: string, value: string) {
    const first = this[varName][key];
    const second = -mapValue(this, value);

    if (typeof first !== "object" && typeof second !== "object") {
      expect(first).to.eql(second);
    } else {
      expect(first.equals(second)).to.be.true;
    }
  },
);

Then(
  new RegExp(
    `^${lowercase.source}\\.${lowercase.source} = ${lowercase.source}$`,
  ),
  function (varName: string, key: string, value: string) {
    const first = this[varName][key];
    const second = mapValue(this, value);

    if (typeof first !== "object" && typeof second !== "object") {
      expect(first).to.eql(second);
    } else {
      expect(first.equals(second)).to.be.true;
    }
  },
);

Then(
  new RegExp(
    `^${lowercase.source}\\.${lowercase.source} = ${lowercase.source}\\.${lowercase.source}$`,
  ),
  function (
    firstVarName: string,
    firstKey: string,
    secondVarName: string,
    secondKey: string,
  ) {
    const first = this[firstVarName][firstKey];
    const second = this[secondVarName][secondKey];

    if (typeof first !== "object" && typeof second !== "object") {
      expect(first).to.eql(second);
    } else {
      expect(first.equals(second)).to.be.true;
    }
  },
);

Then(
  new RegExp(`^${lowercase.source} = ${lowercase.source}$`),
  function (firstVarName: string, secondVarName: string) {
    const first = this[firstVarName];
    const second = mapValue(this, secondVarName);

    expect(first.equals(second)).to.be.true;
  },
);

Then(
  new RegExp(
    `^${lowercase.source} = (point|vector|color)\\(${float.source}, ${float.source}, ${float.source}\\)$`,
  ),
  function (
    varName: string,
    instanceType: "point" | "vector" | "color",
    x: string,
    y: string,
    z: string,
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
  },
);

Then(
  new RegExp(
    `^${lowercase.source}\\.${lowercase.source} = (point|vector|color)\\(${float.source}, ${float.source}, ${float.source}\\)$`,
  ),
  function (
    varName: string,
    key: string,
    instanceType: "point" | "vector" | "color",
    x: string,
    y: string,
    z: string,
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
  },
);

Then("{word} is nothing", function (varName: string) {
  expect(this[varName]).to.be.null;
});

Then(
  new RegExp(
    `^${lowercase.source}\\.${lowercase.source}\\.${lowercase.source} < -EPSILON\\/${float.source}$`,
  ),
  function (varName: string, key: string, subKey: string, divisor: string) {
    const value = parseFloat(this[varName][mapKey(key)][mapKey(subKey)]);

    expect(value).to.be.lessThan(-EPSILON / parseFloat(divisor));
  },
);

Then(
  new RegExp(
    `^${lowercase.source}\\.${lowercase.source}\\.${lowercase.source} > EPSILON\\/${float.source}$`,
  ),
  function (varName: string, key: string, subKey: string, divisor: string) {
    const value = parseFloat(this[varName][mapKey(key)][mapKey(subKey)]);

    expect(value).to.be.greaterThan(EPSILON / parseFloat(divisor));
  },
);

Then(
  new RegExp(
    `^${lowercase.source}\\.${lowercase.source}\\.${lowercase.source} > ${lowercase.source}\\.${lowercase.source}\\.${lowercase.source}$`,
  ),
  function (
    firstVarName: string,
    firstKey: string,
    firstSubKey: string,
    secondVarName: string,
    secondKey: string,
    secondSubKey: string,
  ) {
    const firstValue = parseFloat(
      this[firstVarName][mapKey(firstKey)][mapKey(firstSubKey)],
    );
    const secondValue = parseFloat(
      this[secondVarName][mapKey(secondKey)][mapKey(secondSubKey)],
    );

    expect(firstValue).to.be.greaterThan(secondValue);
  },
);

Then(
  new RegExp(
    `^${lowercase.source}\\.${lowercase.source}\\.${lowercase.source} < ${lowercase.source}\\.${lowercase.source}\\.${lowercase.source}$`,
  ),
  function (
    firstVarName: string,
    firstKey: string,
    firstSubKey: string,
    secondVarName: string,
    secondKey: string,
    secondSubKey: string,
  ) {
    const firstValue = parseFloat(
      this[firstVarName][mapKey(firstKey)][mapKey(firstSubKey)],
    );
    const secondValue = parseFloat(
      this[secondVarName][mapKey(secondKey)][mapKey(secondSubKey)],
    );

    expect(firstValue).to.be.lessThan(secondValue);
  },
);
