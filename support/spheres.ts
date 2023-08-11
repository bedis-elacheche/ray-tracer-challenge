import { DataTable, Given } from "@cucumber/cucumber";

import { Material, Sphere } from "../src";
import { customizeShapeWith } from "./utils";

Given("{word} ← sphere\\()", function (varName: string) {
  this[varName] = new Sphere();
});

Given(
  "{word} ← sphere\\() with:",
  function (varName: string, dataTable: DataTable) {
    this[varName] = customizeShapeWith(new Sphere(), dataTable);
  },
);

Given("{word} ← glass_sphere\\()", function (varName: string) {
  this[varName] = new Sphere(undefined, undefined, Material.Glass());
});

Given(
  "{word} ← glass_sphere\\() with:",
  function (varName: string, dataTable: DataTable) {
    this[varName] = customizeShapeWith(
      new Sphere(undefined, undefined, Material.Glass()),
      dataTable,
    );
  },
);
