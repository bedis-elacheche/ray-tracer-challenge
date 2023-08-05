import { DataTable, Given } from "@cucumber/cucumber";
import { Color, Sphere, Transformations } from "../src";

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
            case value.startsWith("translate("):
            case value.startsWith("translation("): {
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
