import { Given } from "@cucumber/cucumber";

import { SmoothTriangle } from "../src";
import { getPoint, getVector } from "./utils";

Given(
  "{word} ← smooth_triangle\\({word}, {word}, {word}, {word}, {word}, {word})",
  function (
    varName: string,
    p1VarName: string,
    p2VarName: string,
    p3VarName: string,
    n1VarName: string,
    n2VarName: string,
    n3VarName: string,
  ) {
    const p1 = getPoint(this, p1VarName);
    const p2 = getPoint(this, p2VarName);
    const p3 = getPoint(this, p3VarName);
    const n1 = getVector(this, n1VarName);
    const n2 = getVector(this, n2VarName);
    const n3 = getVector(this, n3VarName);

    this[varName] = new SmoothTriangle({ p1, p2, p3, n1, n2, n3 });
  },
);
