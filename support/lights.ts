import { When } from "@cucumber/cucumber";
import { getColor, getLight, getMaterial, getPoint, getVector } from "./utils";
import { Color, Light, Point } from "../src";

When(
  "{word} ← point_light\\(point\\({float}, {float}, {float}), color\\({float}, {float}, {float}))",
  function (
    varName: string,
    x: number,
    y: number,
    z: number,
    r: number,
    g: number,
    b: number
  ) {
    this[varName] = new Light(new Point(x, y, z), new Color(r, g, b));
  }
);

When(
  "{word} ← point_light\\({word}, {word})",
  function (firstVarName: string, secondVarName: string, thirdVarName: string) {
    this[firstVarName] = new Light(
      getPoint(this, secondVarName),
      getColor(this, thirdVarName)
    );
  }
);

When(
  "{word} ← lighting\\({word}, {word}, {word}, {word}, {word})",
  function (
    varName: string,
    materialName: string,
    lightName: string,
    positionName: string,
    eyeName: string,
    normalName: string
  ) {
    const material = getMaterial(this, materialName);
    const light = getLight(this, lightName);
    const position = getPoint(this, positionName);
    const eye = getVector(this, eyeName);
    const normal = getVector(this, normalName);

    this[varName] = light.apply(material, position, eye, normal);
  }
);
