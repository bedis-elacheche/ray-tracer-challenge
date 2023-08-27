import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";

import { Group, Shape } from "../src";
import { getGroup } from "./utils";

Given("{word} ← group\\()", function (varName: string) {
  this[varName] = new Group();
});

When(
  "add_child\\({word}, {word}\\)",
  function (groupVarName: string, shapeVarName: string) {
    const group = getGroup(this, groupVarName);

    group.addChildren([this[shapeVarName]]);
  },
);

When(
  "{word} ← {word} child of {word}",
  function (varName: string, ordinal: string, groupVarName: string) {
    const group = getGroup(this, groupVarName);

    let index = 0;

    switch (ordinal) {
      case "first": {
        index = 0;
        break;
      }
      case "second": {
        index = 1;
        break;
      }
      case "third": {
        index = 2;
        break;
      }
      default: {
        throw "Not implementd!";
      }
    }

    this[varName] = group.children[index];
  },
);

Then(
  "{word} includes {word}",
  function (groupVarName: string, shapeVarName: string) {
    const group = getGroup(this, groupVarName);
    const item = this[shapeVarName];

    expect(
      group.children.find((child) => {
        if (child instanceof Group && item instanceof Group) {
          return child.equals(item);
        }

        if (child instanceof Shape && item instanceof Shape) {
          return child.equals(item);
        }

        return false;
      }),
    ).not.to.be.undefined;
  },
);
