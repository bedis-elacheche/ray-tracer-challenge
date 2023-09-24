import { DataTable, Given } from "@cucumber/cucumber";

import { Plane } from "../src";
import { customizeShapeWith } from "./utils";

Given("{word} ← plane\\()", function (varName: string) {
  this[varName] = new Plane();
});

Given(
  "{word} ← plane\\() with:",
  function (varName: string, dataTable: DataTable) {
    this[varName] = customizeShapeWith(new Plane(), dataTable);
  },
);
