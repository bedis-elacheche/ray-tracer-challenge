import { Given, When } from "@cucumber/cucumber";
import { Intersection } from "../src";
import { getArray, getIntersection, getShape } from "./utils";

Given(
  "{word} ← intersections\\({word}, {word}, {word}, {word})",
  function (
    arrayName: string,
    firstIntersectionVarName: string,
    secondIntersectionVarName: string,
    thirdIntersectionVarName: string,
    fourthIntersectionVarName: string
  ) {
    const first = getIntersection(this, firstIntersectionVarName);
    const second = getIntersection(this, secondIntersectionVarName);
    const third = getIntersection(this, thirdIntersectionVarName);
    const fourth = getIntersection(this, fourthIntersectionVarName);

    this[arrayName] = [first, second, third, fourth];
  }
);

When(
  "{word} ← intersection\\({float}, {word})",
  function (intersectionVarName: string, t: number, shapeVarName: string) {
    const shape = getShape(this, shapeVarName);

    this[intersectionVarName] = new Intersection(t, shape);
  }
);

When(
  "{word} ← intersections\\({word}, {word})",
  function (
    arrayName: string,
    firstIntersectionVarName: string,
    secondIntersectionVarName: string
  ) {
    const first = getIntersection(this, firstIntersectionVarName);
    const second = getIntersection(this, secondIntersectionVarName);

    this[arrayName] = [first, second];
  }
);

When(
  "{word} ← hit\\({word})",
  function (varName: string, intersectionsArrayName: string) {
    const array = getArray(this, intersectionsArrayName, Intersection);

    this[varName] = Intersection.hit(array);
  }
);
