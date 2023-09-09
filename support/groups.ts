import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";

import { CSG, Group, GroupChild, Shape } from "../src";
import {
  getGroup,
  getShape,
  getShapeOrGroupOrCSG,
  int,
  lowercase,
} from "./utils";

Given("{word} ← group\\()", function (varName: string) {
  this[varName] = new Group();
});

Given(
  "{word} ← group\\() of [{word}, {word}]",
  function (groupVarName: string, firstVarName: string, secondVarName: string) {
    const first = getShapeOrGroupOrCSG(this, firstVarName);
    const second = getShapeOrGroupOrCSG(this, secondVarName);

    this[groupVarName] = new Group({
      children: [first, second],
    });
  },
);

Given(
  "{word} ← group\\() of [{word}, {word}, {word}]",
  function (
    groupVarName: string,
    firstVarName: string,
    secondVarName: string,
    thirdVarName: string,
  ) {
    const first = getShapeOrGroupOrCSG(this, firstVarName);
    const second = getShapeOrGroupOrCSG(this, secondVarName);
    const third = getShapeOrGroupOrCSG(this, thirdVarName);

    this[groupVarName] = new Group({
      children: [first, second, third],
    });
  },
);

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

When(
  "\\({word}, {word}) ← partition_children\\({word})",
  function (
    firstHalfVarName: string,
    secondHalfVarName: string,
    groupVarName: string,
  ) {
    const group = getGroup(this, groupVarName);
    const [left, right] = group.partitionChildren();

    this[firstHalfVarName] = left;
    this[secondHalfVarName] = right;
  },
);

When(
  "make_subgroup\\({word}, [{word}, {word}])",
  function (
    groupVarName: string,
    firstShapeVarName: string,
    secondShapeVarName: string,
  ) {
    const group = getGroup(this, groupVarName);
    const first = getShape(this, firstShapeVarName);
    const second = getShape(this, secondShapeVarName);

    group.makeSubGroup([first, second]);
  },
);

Then(
  "{word} includes {word}",
  function (groupVarName: string, shapeVarName: string) {
    const group = getGroup(this, groupVarName);
    const item = getShapeOrGroupOrCSG(this, shapeVarName);

    expect(
      group.children.find((child) => {
        if (child instanceof Group && item instanceof Group) {
          return child.equals(item);
        }

        if (child instanceof CSG && item instanceof CSG) {
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

Then(
  new RegExp(`^${lowercase.source} is a group of \\[${lowercase.source}\\]$`),
  function (groupVarName: string, shapeVarName: string) {
    const group = getGroup(this, groupVarName);
    const item = getShapeOrGroupOrCSG(this, shapeVarName);

    expect(group.children.length).to.equal(1);
    const [child] = group.children;

    if (child instanceof Group && item instanceof Group) {
      expect(child.equals(item)).to.be.true;
    } else if (child instanceof CSG && item instanceof CSG) {
      expect(child.equals(item)).to.be.true;
    } else if (child instanceof Shape && item instanceof Shape) {
      expect(child.equals(item)).to.be.true;
    } else {
      expect(true).to.be.false;
    }
  },
);

Then(
  new RegExp(
    `^${lowercase.source}\\[${int.source}\\] is a group of \\[${lowercase.source}\\]$`,
  ),
  function (groupVarName: string, index: string, shapeVarName: string) {
    const group = getGroup(this, groupVarName);
    const subGroup = group.children[parseInt(index, 10)] as Group;
    expect(subGroup).to.be.instanceOf(Group);

    const item = getShapeOrGroupOrCSG(this, shapeVarName);

    expect(subGroup.children.length).to.equal(1);
    const [child] = subGroup.children;

    if (child instanceof Group && item instanceof Group) {
      expect(child.equals(item)).to.be.true;
    } else if (child instanceof CSG && item instanceof CSG) {
      expect(child.equals(item)).to.be.true;
    } else if (child instanceof Shape && item instanceof Shape) {
      expect(child.equals(item)).to.be.true;
    } else {
      expect(true).to.be.false;
    }
  },
);

Then(
  "{word}[{int}] is a group of [{word}, {word}]",
  function (
    groupVarName: string,
    index: number,
    firstShapeVarName: string,
    secondShapeVarName: string,
  ) {
    const group = getGroup(this, groupVarName);
    const first = getShapeOrGroupOrCSG(this, firstShapeVarName);
    const second = getShapeOrGroupOrCSG(this, secondShapeVarName);

    expect(group.children[index]).to.be.instanceOf(Group);

    const child = group.children[index] as Group;

    expect(child.children.length).to.equal(2);
    const [firstChild, secondChild] = child.children;

    if (firstChild instanceof Group && first instanceof Group) {
      expect(firstChild.equals(first)).to.be.true;
    } else if (firstChild instanceof CSG && first instanceof CSG) {
      expect(firstChild.equals(first)).to.be.true;
    } else if (firstChild instanceof Shape && first instanceof Shape) {
      expect(firstChild.equals(first)).to.be.true;
    } else {
      expect(true).to.be.false;
    }

    if (secondChild instanceof Group && second instanceof Group) {
      expect(secondChild.equals(second)).to.be.true;
    } else if (secondChild instanceof CSG && second instanceof CSG) {
      expect(secondChild.equals(second)).to.be.true;
    } else if (secondChild instanceof Shape && second instanceof Shape) {
      expect(secondChild.equals(second)).to.be.true;
    } else {
      expect(true).to.be.false;
    }
  },
);

Then("{word} = [{word}]", function (varName: string, shapeVarName: string) {
  const group = this[varName] as GroupChild[];
  expect(group).to.be.an("array");

  const item = getShapeOrGroupOrCSG(this, shapeVarName);

  expect(group.length).to.equal(1);
  const [child] = group;

  if (child instanceof Group && item instanceof Group) {
    expect(child.equals(item)).to.be.true;
  } else if (child instanceof CSG && item instanceof CSG) {
    expect(child.equals(item)).to.be.true;
  } else if (child instanceof Shape && item instanceof Shape) {
    expect(child.equals(item)).to.be.true;
  } else {
    expect(true).to.be.false;
  }
});

Then(
  new RegExp(`^${lowercase.source}\\[${int.source}\\] = ${lowercase.source}$`),
  function (varName: string, index: string, shapeVarName: string) {
    const group = getGroup(this, varName);
    const item = getShapeOrGroupOrCSG(this, shapeVarName);
    const child = group.children[parseInt(index, 10)];

    if (child instanceof Group && item instanceof Group) {
      expect(child.equals(item)).to.be.true;
    } else if (child instanceof CSG && item instanceof CSG) {
      expect(child.equals(item)).to.be.true;
    } else if (child instanceof Shape && item instanceof Shape) {
      expect(child.equals(item)).to.be.true;
    } else {
      expect(true).to.be.false;
    }
  },
);

Then(
  "{word} ← {word}[{int}]",
  function (varName: string, groupVarName: string, index: number) {
    const group = getGroup(this, groupVarName);

    this[varName] = group.children[index];
  },
);
