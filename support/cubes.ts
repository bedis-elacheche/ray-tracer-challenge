import { Given } from "@cucumber/cucumber";

import { Cube } from "../src";

Given("{word} ← cube\\()", function (varName: string) {
  this[varName] = new Cube();
});
