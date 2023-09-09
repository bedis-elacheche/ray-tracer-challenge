import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";

import { Color, EPSILON, Group, Point, Vector } from "../src";
import {
  float,
  floatOrInfinity,
  getBoundingBox,
  getMatrix,
  getPoint,
  getShape,
  getShapeOrGroupOrCSG,
  getSphere,
  getTuple,
  getWorld,
  int,
  lowercase,
  mapKey,
  mapValue,
} from "./utils";

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

Given(
  new RegExp(
    `^${lowercase.source}\\.${lowercase.source}\\.${lowercase.source} ← color\\(${float.source}, ${float.source}, ${float.source}\\)$`,
  ),
  function (
    firstVarName: string,
    key: string,
    subKey: string,
    r: string,
    g: string,
    b: string,
  ) {
    const parsed = [r, g, b].map(parseFloat) as [number, number, number];

    this[firstVarName][key][subKey] = new Color(...parsed);
  },
);

Given(
  "{word} ← transform\\({word}, {word})",
  function (varName: string, objName: string, matrixName: string) {
    const matrix = getMatrix(this, matrixName);

    this[varName] = this[objName].transform(matrix);
  },
);

Given(
  "{word} is added to {word}",
  function (varName: string, secondVarName: string) {
    try {
      const world = getWorld(this, secondVarName);
      const shape = getShape(this, varName);

      world.children.push(shape);
    } catch (e) {
      const boundingBox = getBoundingBox(this, secondVarName);
      try {
        const point = getPoint(this, varName);

        boundingBox.add(point);
      } catch (e) {
        const box = getBoundingBox(this, varName);

        boundingBox.add(box);
      }
    }
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
    this[firstVarName] = mapValue(this[secondVarName], mapKey(key));
  },
);

When("divide\\({word}, {int})", function (shapeVarName: string, n: number) {
  const shape = getShapeOrGroupOrCSG(this, shapeVarName);

  shape.divide(n);
});

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
    } else if (variable instanceof Group && key === "count") {
      expect(variable.children).to.have.length(parseInt(value, 10));
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
    `^${lowercase.source} = ${lowercase.source}\\.${lowercase.source}$`,
  ),
  function (firstVarName: string, secondVarName: string, key: string) {
    const first = this[firstVarName];
    const second = this[secondVarName][key];

    if (typeof first !== "object" && typeof second !== "object") {
      expect(first).to.eql(second);
    } else {
      expect(first.equals(second)).to.be.true;
    }
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
    const first = mapValue(this[varName], key);
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
  new RegExp(
    `^${lowercase.source}\\.${lowercase.source} = ${lowercase.source}\\.${lowercase.source}\\[${int.source}\\]$`,
  ),
  function (
    firstVarName: string,
    firstKey: string,
    secondVarName: string,
    secondKey: string,
    index: string,
  ) {
    const first = this[firstVarName][firstKey];
    const second = this[secondVarName][secondKey][parseInt(index, 10) - 1];

    if (typeof first !== "object" && typeof second !== "object") {
      expect(first).to.eql(second);
    } else {
      expect(first.equals(second)).to.be.true;
    }
  },
);

Then(
  new RegExp(
    `^${lowercase.source}\\[${int.source}\\] = ${lowercase.source}\\[${int.source}\\]$`,
  ),
  function (
    firstVarName: string,
    firstVarIndex: string,
    secondVarName: string,
    secondVarIndex: string,
  ) {
    const first = this[firstVarName][parseInt(firstVarIndex, 10)];
    const second = this[secondVarName][parseInt(secondVarIndex, 10)];

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

    if (typeof first !== "object" && typeof second !== "object") {
      expect(first).to.eql(second);
    } else {
      expect(first.equals(second)).to.be.true;
    }
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
    `^${lowercase.source}\\.${lowercase.source} = (point|vector|color)\\((${floatOrInfinity.source}), (${floatOrInfinity.source}), (${floatOrInfinity.source})\\)$`,
  ),
  function (
    varName: string,
    key: string,
    instanceType: "point" | "vector" | "color",
    x: string,
    y: string,
    z: string,
  ) {
    const parseValue = (val: string) => {
      if (val === "infinity") {
        return Infinity;
      }

      if (val === "-infinity") {
        return -Infinity;
      }

      return parseFloat(val);
    };

    const parsed = [x, y, z].map(parseValue) as [number, number, number];

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

Then("{word} is empty", function (varName: string) {
  const item = this[varName];

  if (Array.isArray(item)) {
    expect(item).to.be.empty;
  } else if (item instanceof Group) {
    expect(item.children).to.be.empty;
  } else {
    throw "Not implemented!";
  }
});

Then("{word} is not empty", function (varName: string) {
  const item = this[varName];

  if (Array.isArray(item)) {
    expect(item).not.to.be.empty;
  } else if (item instanceof Group) {
    expect(item.children).not.to.be.empty;
  } else {
    throw "Not implemented!";
  }
});

Then(
  new RegExp(`^${lowercase.source} is nothing$`),
  function (varName: string) {
    expect(this[varName]).to.be.null;
  },
);

Then(
  new RegExp(`^${lowercase.source}\\.${lowercase.source} is nothing`),
  function (varName: string, key: string) {
    const item = this[varName][mapKey(key)];

    expect(item).to.be.null;
  },
);

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

Then("{word} is a {word}", function (varName: string, type: string) {
  switch (type) {
    case "sphere": {
      getSphere(this, varName);
      break;
    }
    case "point": {
      const tuple = getTuple(this, varName);

      expect(Point.isPoint(tuple)).to.be.true;
      break;
    }
    case "vector": {
      const tuple = getTuple(this, varName);

      expect(Vector.isVector(tuple)).to.be.true;
      break;
    }
  }
});
