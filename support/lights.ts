import { When } from "@cucumber/cucumber";

import { Color, Light, Point } from "../src";
import {
  float,
  getBoolean,
  getColor,
  getLight,
  getMaterial,
  getPoint,
  getShape,
  getVector,
  lowercase,
} from "./utils";

When(
  new RegExp(
    `^${lowercase.source} ← point_light\\(point\\(${float.source}, ${float.source}, ${float.source}\\), color\\(${float.source}, ${float.source}, ${float.source}\\)\\)$`,
  ),
  function (
    varName: string,
    x: string,
    y: string,
    z: string,
    r: string,
    g: string,
    b: string,
  ) {
    this[varName] = new Light(
      new Point(parseFloat(x), parseFloat(y), parseFloat(z)),
      new Color(parseFloat(r), parseFloat(g), parseFloat(b)),
    );
  },
);

When(
  new RegExp(
    `^${lowercase.source}\\.${lowercase.source} ← point_light\\(point\\(${float.source}, ${float.source}, ${float.source}\\), color\\(${float.source}, ${float.source}, ${float.source}\\)\\)$`,
  ),
  function (
    varName: string,
    key: string,
    x: string,
    y: string,
    z: string,
    r: string,
    g: string,
    b: string,
  ) {
    this[varName][key] = new Light(
      new Point(parseFloat(x), parseFloat(y), parseFloat(z)),
      new Color(parseFloat(r), parseFloat(g), parseFloat(b)),
    );
  },
);

When(
  "{word} ← point_light\\({word}, {word})",
  function (firstVarName: string, secondVarName: string, thirdVarName: string) {
    this[firstVarName] = new Light(
      getPoint(this, secondVarName),
      getColor(this, thirdVarName),
    );
  },
);

When(
  "{word} ← lighting\\({word}, {word}, {word}, {word}, {word}, {word}, {word})",
  function (
    varName: string,
    materialName: string,
    shapeName: string,
    lightName: string,
    positionName: string,
    eyeName: string,
    normalName: string,
    inShadowName: string,
  ) {
    const material = getMaterial(this, materialName);
    const light = getLight(this, lightName);
    const position = getPoint(this, positionName);
    const shape = getShape(this, shapeName);
    const eye = getVector(this, eyeName);
    const normal = getVector(this, normalName);
    const inShadow = getBoolean(this, inShadowName);

    this[varName] = light.apply(
      material,
      shape,
      position,
      eye,
      normal,
      inShadow,
    );
  },
);

When(
  "{word} ← lighting\\({word}, {word}, {word}, point\\({float}, {float}, {float}), {word}, {word}, false)",
  function (
    varName: string,
    materialName: string,
    shapeName: string,
    lightName: string,
    x: number,
    y: number,
    z: number,
    eyeName: string,
    normalName: string,
  ) {
    const material = getMaterial(this, materialName);
    const shape = getShape(this, shapeName);
    const light = getLight(this, lightName);
    const eye = getVector(this, eyeName);
    const normal = getVector(this, normalName);

    this[varName] = light.apply(
      material,
      shape,
      new Point(x, y, z),
      eye,
      normal,
      false,
    );
  },
);
