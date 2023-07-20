import { DataTable, Given, Then, When } from "@cucumber/cucumber";
import { Color, Matrix, Point, Sphere, Transformations } from "../src";
import { float, getMatrix, getSphere } from "./utils";

Given("{word} ← sphere\\()", function (varName: string) {
  this[varName] = new Sphere();
});

Given(
  "{word} ← sphere\\() with:",
  function (varName: string, dataTable: DataTable) {
    const sphere = new Sphere();

    const getNumericParameters = (str: string) => {
      return str
        .slice(str.indexOf("(") + 1, str.indexOf(")"))
        .split(", ")
        .map(parseFloat);
    };

    for (const [key, value] of Object.entries(dataTable.rowsHash())) {
      switch (key) {
        case "material.color": {
          const [r, g, b] = getNumericParameters(value);
          sphere.material.color = new Color(r, g, b);
          break;
        }
        case "material.diffuse": {
          sphere.material.diffuse = parseFloat(value);
          break;
        }
        case "material.specular": {
          sphere.material.specular = parseFloat(value);
          break;
        }
        case "transform": {
          switch (true) {
            case value.startsWith("scaling("): {
              const [x, y, z] = getNumericParameters(value);
              sphere.transform = Transformations.scale(x, y, z);
              break;
            }
            case value.startsWith("translate("): {
              const [x, y, z] = getNumericParameters(value);
              sphere.transform = Transformations.translation(x, y, z);
              break;
            }
            default:
              throw `transformation ${value} setter not implemented`;
          }
          break;
        }
        default:
          throw `${key} setter not implemented`;
      }
    }

    this[varName] = sphere;
  }
);

When(
  "set_transform\\({word}, {word})",
  function (sphereVarName: string, matrixVarName: string) {
    const sphere = getSphere(this, sphereVarName);
    const matrix = getMatrix(this, matrixVarName);

    sphere.transform = matrix;
  }
);

When(
  "set_transform\\({word}, translation\\({float}, {float}, {float}))",
  function (sphereVarName: string, x: number, y: number, z: number) {
    const sphere = getSphere(this, sphereVarName);

    sphere.transform = Transformations.translation(x, y, z);
  }
);

When(
  "set_transform\\({word}, scaling\\({float}, {float}, {float}))",
  function (sphereVarName: string, x: number, y: number, z: number) {
    const sphere = getSphere(this, sphereVarName);

    sphere.transform = Transformations.scale(x, y, z);
  }
);

When(
  "{word} ← normal_at\\({word}, point\\({float}, {float}, {float}))",
  function (
    normalVarName: string,
    sphereVarName: string,
    x: number,
    y: number,
    z: number
  ) {
    const sphere = getSphere(this, sphereVarName);

    this[normalVarName] = sphere.normalAt(new Point(x, y, z));
  }
);
