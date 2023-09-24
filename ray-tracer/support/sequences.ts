import { Given, Then } from "@cucumber/cucumber";
import { expect } from "chai";

import { sequence } from "../src";
import { float, lowercase, mapKey } from "./utils";

Given(
  "{word} ← sequence\\({float}, {float}, {float})",
  function (varName: string, a: number, b: number, c: number) {
    this[varName] = sequence(a, b, c);
  },
);

Given(
  new RegExp(
    `^${lowercase.source}\\.${lowercase.source} ← sequence\\(${float.source}, ${float.source}\\)$`,
  ),
  function (varName: string, key: string, a: string, b: string) {
    this[varName][mapKey(key)] = sequence(parseFloat(a), parseFloat(b));
  },
);

Then("next\\({word}) = {float}", function (varName: string, value: number) {
  const gen: Generator<number, void, unknown> = this[varName];
  expect(gen.next().value).to.eql(value);
});
