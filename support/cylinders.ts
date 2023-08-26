import { Given } from "@cucumber/cucumber";

import { Cylinder } from "../src";

Given("{word} ← cylinder\\()", function (varName: string) {
  this[varName] = new Cylinder();
});
