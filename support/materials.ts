import { Given, Then } from "@cucumber/cucumber";
import { expect } from "chai";

import { Material } from "../src";
import { getMaterial } from "./utils";

Given("{word} ← material\\()", function (varName: string) {
  this[varName] = new Material();
});

Then("{word} = material\\()", function (varName: string) {
  const material = getMaterial(this, varName);

  expect(material.equals(new Material())).to.be.true;
});
