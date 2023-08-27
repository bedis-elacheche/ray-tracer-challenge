import { Given, When } from "@cucumber/cucumber";

import { Intersection, Shape } from "../src";
import {
  float,
  getArray,
  getIntersection,
  getShape,
  lowercase,
  uppercase,
} from "./utils";

Given(
  new RegExp(`^${lowercase.source} ← intersections\\(${lowercase.source}\\)$`),
  function (arrayName: string, intersectionVarName: string) {
    const intersection = getIntersection(this, intersectionVarName);

    this[arrayName] = [intersection];
  },
);

Given(
  new RegExp(
    `^${lowercase.source} ← intersections\\(${lowercase.source}, ${lowercase.source}, ${lowercase.source}, ${lowercase.source}\\)$`,
  ),
  function (
    arrayName: string,
    firstIntersectionVarName: string,
    secondIntersectionVarName: string,
    thirdIntersectionVarName: string,
    fourthIntersectionVarName: string,
  ) {
    const first = getIntersection(this, firstIntersectionVarName);
    const second = getIntersection(this, secondIntersectionVarName);
    const third = getIntersection(this, thirdIntersectionVarName);
    const fourth = getIntersection(this, fourthIntersectionVarName);

    this[arrayName] = [first, second, third, fourth];
  },
);

Given(
  new RegExp(
    `^${lowercase.source} ← intersections\\(${float.source}:${lowercase.source}\\)$`,
  ),
  function (intersectionVarName: string, t: string, shapeVarName: string) {
    const shape = getShape(this, shapeVarName);

    this[intersectionVarName] = [new Intersection(parseFloat(t), shape)];
  },
);

Given(
  new RegExp(
    `^${lowercase.source} ← intersections\\(${float.source}:${uppercase.source}, ${float.source}:${uppercase.source}, ${float.source}:${uppercase.source}, ${float.source}:${uppercase.source}\\)$`,
  ),
  function (
    intersectionVarName: string,
    t1: string,
    firstShapeVarName: string,
    t2: string,
    secondShapeVarName: string,
    t3: string,
    thirdShapeVarName: string,
    t4: string,
    fourthShapeVarName: string,
  ) {
    const first = getShape(this, firstShapeVarName);
    const second = getShape(this, secondShapeVarName);
    const third = getShape(this, thirdShapeVarName);
    const fourth = getShape(this, fourthShapeVarName);

    this[intersectionVarName] = [
      [t1, first],
      [t2, second],
      [t3, third],
      [t4, fourth],
    ].map(
      ([t, shape]: [string, Shape]) => new Intersection(parseFloat(t), shape),
    );
  },
);

Given(
  new RegExp(
    `^${lowercase.source} ← intersections\\(${float.source}:${lowercase.source}, ${float.source}:${lowercase.source}, ${float.source}:${lowercase.source}, ${float.source}:${lowercase.source}\\)$`,
  ),
  function (
    intersectionVarName: string,
    t1: string,
    firstShapeVarName: string,
    t2: string,
    secondShapeVarName: string,
    t3: string,
    thirdShapeVarName: string,
    t4: string,
    fourthShapeVarName: string,
  ) {
    const first = getShape(this, firstShapeVarName);
    const second = getShape(this, secondShapeVarName);
    const third = getShape(this, thirdShapeVarName);
    const fourth = getShape(this, fourthShapeVarName);

    this[intersectionVarName] = [
      [t1, first],
      [t2, second],
      [t3, third],
      [t4, fourth],
    ].map(
      ([t, shape]: [string, Shape]) => new Intersection(parseFloat(t), shape),
    );
  },
);

Given(
  new RegExp(
    `^${lowercase.source} ← intersections\\(${float.source}:${uppercase.source}, ${float.source}:${uppercase.source}, ${float.source}:${uppercase.source}, ${float.source}:${uppercase.source}, ${float.source}:${uppercase.source}, ${float.source}:${uppercase.source}\\)$`,
  ),
  function (
    intersectionVarName: string,
    t1: string,
    firstShapeVarName: string,
    t2: string,
    secondShapeVarName: string,
    t3: string,
    thirdShapeVarName: string,
    t4: string,
    fourthShapeVarName: string,
    t5: string,
    fifthShapeVarName: string,
    t6: string,
    sixthShapeVarName: string,
  ) {
    const first = getShape(this, firstShapeVarName);
    const second = getShape(this, secondShapeVarName);
    const third = getShape(this, thirdShapeVarName);
    const fourth = getShape(this, fourthShapeVarName);
    const fifth = getShape(this, fifthShapeVarName);
    const sixth = getShape(this, sixthShapeVarName);

    this[intersectionVarName] = [
      [t1, first],
      [t2, second],
      [t3, third],
      [t4, fourth],
      [t5, fifth],
      [t6, sixth],
    ].map(
      ([t, shape]: [string, Shape]) => new Intersection(parseFloat(t), shape),
    );
  },
);

Given(
  new RegExp(
    `^${lowercase.source} ← intersections\\(${float.source}:${lowercase.source}, ${float.source}:${lowercase.source}\\)$`,
  ),
  function (
    intersectionVarName: string,
    t1: string,
    firstShapeVarName: string,
    t2: string,
    secondShapeVarName: string,
  ) {
    const first = getShape(this, firstShapeVarName);
    const second = getShape(this, secondShapeVarName);

    this[intersectionVarName] = [
      [t1, first],
      [t2, second],
    ].map(
      ([t, shape]: [string, Shape]) => new Intersection(parseFloat(t), shape),
    );
  },
);

When(
  "{word} ← intersection\\({float}, {word})",
  function (intersectionVarName: string, t: number, shapeVarName: string) {
    const shape = getShape(this, shapeVarName);
    this[intersectionVarName] = new Intersection(t, shape);
  },
);

When(
  "{word} ← intersection_with_uv\\({float}, {word}, {float}, {float})",
  function (
    intersectionVarName: string,
    t: number,
    shapeVarName: string,
    u: number,
    v: number,
  ) {
    const shape = getShape(this, shapeVarName);
    this[intersectionVarName] = new Intersection(t, shape, u, v);
  },
);

When(
  new RegExp(
    `^${lowercase.source} ← intersections\\(${lowercase.source}, ${lowercase.source}\\)$`,
  ),
  function (
    arrayName: string,
    firstIntersectionVarName: string,
    secondIntersectionVarName: string,
  ) {
    const first = getIntersection(this, firstIntersectionVarName);
    const second = getIntersection(this, secondIntersectionVarName);

    this[arrayName] = [first, second];
  },
);

When(
  "{word} ← hit\\({word})",
  function (varName: string, intersectionsArrayName: string) {
    const array = getArray(this, intersectionsArrayName, Intersection);

    this[varName] = Intersection.hit(array);
  },
);
