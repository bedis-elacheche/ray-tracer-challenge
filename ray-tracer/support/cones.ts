import { Given } from "@cucumber/cucumber";

import { Cone } from "../src";

Given("{word} ← cone\\()", function (varName: string) {
  this[varName] = new Cone();
});
