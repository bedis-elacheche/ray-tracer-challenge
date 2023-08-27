import { Then, When } from "@cucumber/cucumber";
import { expect } from "chai";

import {
  CSG,
  CSGOperand,
  CSGOperation,
  Cube,
  Intersection,
  Sphere,
} from "../src";
import { getArray, getCSG, getCSGOperand, lowercase } from "./utils";

const operation = /"(union|intersection|difference)"/;

When(
  "{word} ← csg\\({string}, sphere\\(), cube\\())",
  function (varName: string, operation: CSGOperation) {
    this[varName] = new CSG({
      operation,
      left: new Sphere(),
      right: new Cube(),
    });
  },
);

When(
  new RegExp(
    `${lowercase.source} ← csg\\(${operation.source}, ${lowercase.source}, ${lowercase.source}\\)`,
  ),
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

When(
  "{word} ← filter_intersections\\({word}, {word})",
  function (varName: string, csgVarName: string, intersectionsVarName: string) {
    const csg = getCSG(this, csgVarName);
    const intersections = getArray(
      this,
      intersectionsVarName,
      Intersection<CSGOperand>,
    );

    this[varName] = csg.filterIntersections(intersections);
  },
);

Then(
  "{word}.operation = {string}",
  function (varName: string, operation: CSGOperation) {
    const csg = getCSG(this, varName);

    expect(csg.operation).to.equal(operation);
  },
);
