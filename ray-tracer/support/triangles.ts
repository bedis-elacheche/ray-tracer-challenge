import { Given } from "@cucumber/cucumber";

import { Point, Triangle } from "../src";
import { getPoint } from "./utils";

Given(
  "{word} ← triangle\\({word}, {word}, {word})",
  function (
    varName: string,
    p1VarName: string,
    p2VarName: string,
    p3VarName: string,
  ) {
    const p1 = getPoint(this, p1VarName);
    const p2 = getPoint(this, p2VarName);
    const p3 = getPoint(this, p3VarName);

    this[varName] = new Triangle({ p1, p2, p3 });
  },
);

Given(
  "{word} ← triangle\\(point\\({float}, {float}, {float}), point\\({float}, {float}, {float}), point\\({float}, {float}, {float}))",
  function (
    varName: string,
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number,
    x3: number,
    y3: number,
    z3: number,
  ) {
    this[varName] = new Triangle({
      p1: new Point(x1, y1, z1),
      p2: new Point(x2, y2, z2),
      p3: new Point(x3, y3, z3),
    });
  },
);
