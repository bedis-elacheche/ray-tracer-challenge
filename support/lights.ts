import { When } from "@cucumber/cucumber";

import { AreaLight, Color, Point, PointLight } from "../src";
import {
  float,
  getAreaLight,
  getBoolean,
  getColor,
  getLight,
  getMaterial,
  getPoint,
  getPointLight,
  getShape,
  getVector,
  getWorld,
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
    this[varName] = new PointLight({
      position: new Point(parseFloat(x), parseFloat(y), parseFloat(z)),
      intensity: new Color(parseFloat(r), parseFloat(g), parseFloat(b)),
    });
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
    const world = getWorld(this, varName);

    world.lights = [
      new PointLight({
        position: new Point(parseFloat(x), parseFloat(y), parseFloat(z)),
        intensity: new Color(parseFloat(r), parseFloat(g), parseFloat(b)),
      }),
    ];
  },
);

When(
  "{word} ← point_light\\({word}, {word})",
  function (firstVarName: string, secondVarName: string, thirdVarName: string) {
    this[firstVarName] = new PointLight({
      position: getPoint(this, secondVarName),
      intensity: getColor(this, thirdVarName),
    });
  },
);

//     When light ← area_light(corner, v1, 4, v2, 2, color(1, 1, 1))

When(
  "{word} ← area_light\\({word}, {word}, {int}, {word}, {int}, color\\({float}, {float}, {float}))",
  function (
    firstVarName: string,
    cornerVarName: string,
    uvecVarName: string,
    usteps: number,
    vvecVarName: string,
    vsteps: number,
    r: number,
    g: number,
    b: number,
  ) {
    this[firstVarName] = new AreaLight({
      corner: getPoint(this, cornerVarName),
      intensity: new Color(r, g, b),
      vvec: getVector(this, vvecVarName),
      vsteps,
      uvec: getVector(this, uvecVarName),
      usteps,
    });
  },
);

When(
  "{word} ← intensity_at\\({word}, {word}, {word})",
  function (
    firstVarName: string,
    lightVarName: string,
    pointVarName: string,
    worldVarName: string,
  ) {
    const light = getLight(this, lightVarName);
    const point = getPoint(this, pointVarName);
    const world = getWorld(this, worldVarName);

    this[firstVarName] = light.intensityAt(point, world);
  },
);

When(
  new RegExp(
    `^${lowercase.source} ← lighting\\(${lowercase.source}, ${lowercase.source}, ${lowercase.source}, ${lowercase.source}, ${lowercase.source}, ${lowercase.source}, ${float.source}\\)$`,
  ),
  function (
    varName: string,
    materialName: string,
    shapeName: string,
    lightName: string,
    positionName: string,
    eyeName: string,
    normalName: string,
    intensity: string,
  ) {
    const material = getMaterial(this, materialName);
    const light = getLight(this, lightName);
    const position = getPoint(this, positionName);
    const shape = getShape(this, shapeName);
    const eye = getVector(this, eyeName);
    const normal = getVector(this, normalName);

    this[varName] = light.apply(
      material,
      shape,
      position,
      eye,
      normal,
      parseFloat(intensity),
    );
  },
);

When(
  new RegExp(
    `^${lowercase.source} ← lighting\\(${lowercase.source}, ${lowercase.source}, ${lowercase.source}, ${lowercase.source}, ${lowercase.source}, ${lowercase.source}, ${lowercase.source}\\)$`,
  ),
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
      inShadow ? 0 : 1,
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
    const light = getPointLight(this, lightName);
    const eye = getVector(this, eyeName);
    const normal = getVector(this, normalName);

    this[varName] = light.apply(
      material,
      shape,
      new Point(x, y, z),
      eye,
      normal,
      1,
    );
  },
);

When(
  "{word} ← lighting\\({word}.material, {word}.light, {word}, {word}, {word}, {float})",
  function (
    varName: string,
    shapeName: string,
    worldlName: string,
    positionName: string,
    eyeName: string,
    normalName: string,
    intensity: number,
  ) {
    const shape = getShape(this, shapeName);
    const material = shape.material;
    const world = getWorld(this, worldlName);
    const light = world.lights[0];
    const position = getPoint(this, positionName);
    const eye = getVector(this, eyeName);
    const normal = getVector(this, normalName);

    this[varName] = light.apply(
      material,
      shape,
      position,
      eye,
      normal,
      intensity,
    );
  },
);

When(
  "{word} ← point_on_light\\({word}, {float}, {float})",
  function (varName: string, lightVarName: string, u: number, v: number) {
    const light = getAreaLight(this, lightVarName);

    this[varName] = light.pointOnLight(u, v);
  },
);
