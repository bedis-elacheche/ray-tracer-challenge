import { Then } from "@cucumber/cucumber";
import { expect } from "chai";

Then(
  "{word}.{word} = {float}",
  function (varName: string, key: string, value: number) {
    expect(this[varName]?.[key]).to.eq(value);
  }
);
