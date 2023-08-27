import { Then, When } from "@cucumber/cucumber";
import { expect } from "chai";

import { CSG, CSGOperation } from "../src";
import { getCSG, getCSGOperand } from "./utils";

When(
  "{word} ← csg\\({string}, {word}, {word})",
  function (
    varName: string,
    operation: CSGOperation,
    firstShapeVarName: string,
    secondShapeVarName: string,
  ) {
    const first = getCSGOperand(this, firstShapeVarName);
    const second = getCSGOperand(this, secondShapeVarName);

    this[varName] = new CSG({
      operation,
      left: first,
      right: second,
    });
  },
);

When(
  "{word} ← intersection_allowed\\({string}, {word}, {word}, {word})",
  function (
    varName: string,
    operation: CSGOperation,
    lhit: string,
    inl: string,
    inr: string,
  ) {
    this[varName] = CSG.isIntersectionAllowed(
      operation,
      lhit === "true",
      inl === "true",
      inr === "true",
    );
  },
);

Then(
  "{word}.operation = {string}",
  function (varName: string, operation: CSGOperation) {
    const csg = getCSG(this, varName);

    expect(csg.operation).to.equal(operation);
  },
);
