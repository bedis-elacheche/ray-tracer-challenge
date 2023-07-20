import { When } from "@cucumber/cucumber";
import {
  float,
  getColor,
  getLight,
  getMaterial,
  getPoint,
  getVector,
  lowercase,
} from "./utils";
import { Color, Light, Point } from "../src";

When(
  new RegExp(
    `^${lowercase.source} ← point_light\\(point\\(${float.source}, ${float.source}, ${float.source}\\), color\\(${float.source}, ${float.source}, ${float.source}\\)\\)$`
  ),
  function (
    varName: string,
    x: string,
    y: string,
    z: string,
    r: string,
    g: string,
    b: string
  ) {
    this[varName] = new Light(
      new Point(parseFloat(x), parseFloat(y), parseFloat(z)),
      new Color(parseFloat(r), parseFloat(g), parseFloat(b))
    );
  }
);

When(
  new RegExp(
    `^${lowercase.source}\\.${lowercase.source} ← point_light\\(point\\(${float.source}, ${float.source}, ${float.source}\\), color\\(${float.source}, ${float.source}, ${float.source}\\)\\)$`
  ),
  function (
    varName: string,
    key: string,
    x: string,
    y: string,
    z: string,
    r: string,
    g: string,
    b: string
  ) {
    this[varName][key] = new Light(
      new Point(parseFloat(x), parseFloat(y), parseFloat(z)),
      new Color(parseFloat(r), parseFloat(g), parseFloat(b))
    );
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
