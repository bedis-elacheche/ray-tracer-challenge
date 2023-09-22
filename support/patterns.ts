import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";

import {
  CheckersPattern,
  Color,
  cubicBackFace,
  cubicDownFace,
  cubicFaceFromPoint,
  cubicFrontFace,
  cubicLeftFace,
  cubicRightFace,
  cubicUpFace,
  GradientPattern,
  Point,
  RingPattern,
  SolidPattern,
  StripesPattern,
  TextureMapPattern,
  Transformations,
  UVAlignCheckPattern,
  UVCheckersPattern,
  UVImagePattern,
  UVMap,
  UVMapType,
  XYZPattern,
} from "../src";
import {
  getCanvas,
  getColor,
  getMaterial,
  getPatternOrTextureMap,
  getPoint,
  getShape,
  getString,
  getStripe,
  getUVPattern,
  getXYZPattern,
  lowercase,
} from "./utils";

Given("{word} ← test_pattern\\()", function (varName: string) {
  this[varName] = new XYZPattern();
});

Given(
  "{word} ← stripe_pattern\\({word}, {word})",
  function (varName: string, firstColorName: string, secondColorName: string) {
    const firstColor = getColor(this, firstColorName);
    const secondColor = getColor(this, secondColorName);

    this[varName] = new StripesPattern({
      patterns: [
        new SolidPattern({ color: firstColor }),
        new SolidPattern({ color: secondColor }),
      ],
    });
  },
);

Given(
  "{word} ← gradient_pattern\\({word}, {word})",
  function (varName: string, firstColorName: string, secondColorName: string) {
    const firstColor = getColor(this, firstColorName);
    const secondColor = getColor(this, secondColorName);

    this[varName] = new GradientPattern({
      patterns: [
        new SolidPattern({ color: firstColor }),
        new SolidPattern({ color: secondColor }),
      ],
    });
  },
);

Given(
  "{word} ← ring_pattern\\({word}, {word})",
  function (varName: string, firstColorName: string, secondColorName: string) {
    const firstColor = getColor(this, firstColorName);
    const secondColor = getColor(this, secondColorName);

    this[varName] = new RingPattern({
      patterns: [
        new SolidPattern({ color: firstColor }),
        new SolidPattern({ color: secondColor }),
      ],
    });
  },
);

Given(
  "{word} ← checkers_pattern\\({word}, {word})",
  function (varName: string, firstColorName: string, secondColorName: string) {
    const firstColor = getColor(this, firstColorName);
    const secondColor = getColor(this, secondColorName);

    this[varName] = new CheckersPattern({
      patterns: [
        new SolidPattern({ color: firstColor }),
        new SolidPattern({ color: secondColor }),
      ],
    });
  },
);

Given(
  "{word} ← uv_checkers\\({float}, {float}, {word}, {word})",
  function (
    varName: string,
    width: number,
    height: number,
    firstColorName: string,
    secondColorName: string,
  ) {
    const firstColor = getColor(this, firstColorName);
    const secondColor = getColor(this, secondColorName);

    this[varName] = new UVCheckersPattern({
      height,
      width,
      patterns: [
        new SolidPattern({ color: firstColor }),
        new SolidPattern({ color: secondColor }),
      ],
    });
  },
);

Given(
  "{word} ← uv_image\\({word})",
  function (varName: string, canvasVarName: string) {
    const canvas = getCanvas(this, canvasVarName);

    this[varName] = new UVImagePattern({ canvas });
  },
);

Given(
  "{word}.pattern ← stripe_pattern\\(color\\({float}, {float}, {float}), color\\({float}, {float}, {float}))",
  function (
    varName: string,
    ra: number,
    ga: number,
    ba: number,
    rb: number,
    gb: number,
    bb: number,
  ) {
    const material = getMaterial(this, varName);

    material.pattern = new StripesPattern({
      patterns: [
        new SolidPattern({ color: new Color(ra, ga, ba) }),
        new SolidPattern({ color: new Color(rb, gb, bb) }),
      ],
    });
  },
);

Given(
  "set_pattern_transform\\({word}, scaling\\({float}, {float}, {float}))",
  function (patternVarName: string, x: number, y: number, z: number) {
    const pattern = getXYZPattern(this, patternVarName);

    pattern.transform = Transformations.scale(x, y, z);
  },
);

Given(
  "set_pattern_transform\\({word}, translation\\({float}, {float}, {float}))",
  function (patternVarName: string, x: number, y: number, z: number) {
    const pattern = getXYZPattern(this, patternVarName);

    pattern.transform = Transformations.translation(x, y, z);
  },
);

Given(
  "{word} ← texture_map\\({word}, {word})",
  function (varName: string, uvPatternVarName: string, uvMapType: string) {
    const pattern = getUVPattern(this, uvPatternVarName);
    let map: UVMapType;

    switch (uvMapType) {
      case "spherical_map": {
        map = "spherical";
        break;
      }
      case "planar_map": {
        map = "planar";
        break;
      }
      case "cylindrical_map": {
        map = "cylindrical";
        break;
      }
      default: {
        throw "Not supported";
      }
    }

    this[varName] = new TextureMapPattern({ patterns: { main: pattern }, map });
  },
);

Given(
  "{word} ← uv_align_check\\({word}, {word}, {word}, {word}, {word})",
  function (
    varName: string,
    mainVarName: string,
    ulVarName: string,
    urVarName: string,
    blVarName: string,
    brVarName: string,
  ) {
    const main = getColor(this, mainVarName);
    const ul = getColor(this, ulVarName);
    const ur = getColor(this, urVarName);
    const bl = getColor(this, blVarName);
    const br = getColor(this, brVarName);

    this[varName] = new UVAlignCheckPattern({
      main: new SolidPattern({ color: main }),
      ul: new SolidPattern({ color: ul }),
      ur: new SolidPattern({ color: ur }),
      bl: new SolidPattern({ color: bl }),
      br: new SolidPattern({ color: br }),
    });
  },
);

When(
  "{word} ← stripe_at_object\\({word}, {word}, point\\({float}, {float}, {float}))",
  function (
    varName: string,
    patternVarName: string,
    shapeVarName: string,
    x: number,
    y: number,
    z: number,
  ) {
    const stripe = getStripe(this, patternVarName);
    const shape = getShape(this, shapeVarName);

    this[varName] = stripe.colorAt(new Point(x, y, z), shape);
  },
);

When(
  "{word} ← pattern_at_shape\\({word}, {word}, point\\({float}, {float}, {float}))",
  function (
    varName: string,
    patternVarName: string,
    shapeVarName: string,
    x: number,
    y: number,
    z: number,
  ) {
    const pattern = getXYZPattern(this, patternVarName);
    const shape = getShape(this, shapeVarName);

    this[varName] = pattern.colorAt(new Point(x, y, z), shape);
  },
);

When(
  "{word} ← uv_pattern_at\\({word}, {float}, {float})",
  function (varName: string, patternVarName: string, u: number, v: number) {
    const pattern = getUVPattern(this, patternVarName);

    this[varName] = pattern.colorAt(u, v);
  },
);

When(
  "\\({word}, {word}) ← spherical_map\\({word})",
  function (uVarName: string, vVarName: string, pointVarName: string) {
    const point = getPoint(this, pointVarName);
    const [[u, v]] = UVMap.map(point, "spherical");

    this[uVarName] = u;
    this[vVarName] = v;
  },
);

When(
  "{word} ← face_from_point\\(point\\({float}, {float}, {float}))",
  function (varName: string, x: number, y: number, z: number) {
    this[varName] = cubicFaceFromPoint(new Point(x, y, z));
  },
);

When(
  "\\({word}, {word}) ← cube_uv_front\\(point\\({float}, {float}, {float}))",
  function (
    uVarName: string,
    vVarName: string,
    x: number,
    y: number,
    z: number,
  ) {
    const [[u, v]] = cubicFrontFace(new Point(x, y, z));

    this[uVarName] = u;
    this[vVarName] = v;
  },
);

When(
  "\\({word}, {word}) ← cube_uv_back\\(point\\({float}, {float}, {float}))",
  function (
    uVarName: string,
    vVarName: string,
    x: number,
    y: number,
    z: number,
  ) {
    const [[u, v]] = cubicBackFace(new Point(x, y, z));

    this[uVarName] = u;
    this[vVarName] = v;
  },
);

When(
  "\\({word}, {word}) ← cube_uv_left\\(point\\({float}, {float}, {float}))",
  function (
    uVarName: string,
    vVarName: string,
    x: number,
    y: number,
    z: number,
  ) {
    const [[u, v]] = cubicLeftFace(new Point(x, y, z));

    this[uVarName] = u;
    this[vVarName] = v;
  },
);

When(
  "\\({word}, {word}) ← cube_uv_right\\(point\\({float}, {float}, {float}))",
  function (
    uVarName: string,
    vVarName: string,
    x: number,
    y: number,
    z: number,
  ) {
    const [[u, v]] = cubicRightFace(new Point(x, y, z));

    this[uVarName] = u;
    this[vVarName] = v;
  },
);

When(
  "\\({word}, {word}) ← cube_uv_up\\(point\\({float}, {float}, {float}))",
  function (
    uVarName: string,
    vVarName: string,
    x: number,
    y: number,
    z: number,
  ) {
    const [[u, v]] = cubicUpFace(new Point(x, y, z));

    this[uVarName] = u;
    this[vVarName] = v;
  },
);

When(
  "\\({word}, {word}) ← cube_uv_down\\(point\\({float}, {float}, {float}))",
  function (
    uVarName: string,
    vVarName: string,
    x: number,
    y: number,
    z: number,
  ) {
    const [[u, v]] = cubicDownFace(new Point(x, y, z));

    this[uVarName] = u;
    this[vVarName] = v;
  },
);

When(
  "\\({word}, {word}) ← planar_map\\({word})",
  function (uVarName: string, vVarName: string, pointVarName: string) {
    const point = getPoint(this, pointVarName);
    const [[u, v]] = UVMap.map(point, "planar");

    this[uVarName] = u;
    this[vVarName] = v;
  },
);

When(
  "\\({word}, {word}) ← cylindrical_map\\({word})",
  function (uVarName: string, vVarName: string, pointVarName: string) {
    const point = getPoint(this, pointVarName);
    const [[u, v]] = UVMap.map(point, "cylindrical");

    this[uVarName] = u;
    this[vVarName] = v;
  },
);

When(
  "{word} ← cube_map\\({word}, {word}, {word}, {word}, {word}, {word})",
  function (
    varName: string,
    leftVarName: string,
    frontVarName: string,
    rightVarName: string,
    backVarName: string,
    upVarName: string,
    downVarName: string,
  ) {
    const left = getUVPattern(this, leftVarName);
    const front = getUVPattern(this, frontVarName);
    const right = getUVPattern(this, rightVarName);
    const back = getUVPattern(this, backVarName);
    const up = getUVPattern(this, upVarName);
    const down = getUVPattern(this, downVarName);

    this[varName] = new TextureMapPattern({
      map: "cubic",
      patterns: { left, front, right, back, up, down },
    });
  },
);

Then(
  new RegExp(`^${lowercase.source} = "${lowercase.source}"$`),
  function (varName: string, value: string) {
    const string = getString(this, varName);

    expect(string).to.be.equal(value);
  },
);

Then(
  "stripe_at\\({word}, point\\({float}, {float}, {float})) = {word}",
  function (
    varName: string,
    x: number,
    y: number,
    z: number,
    colorName: string,
  ) {
    const stripe = getStripe(this, varName);
    const color = getColor(this, colorName);
    const point = new Point(x, y, z);

    expect(stripe.colorAt(point).equals(color)).to.be.true;
  },
);

Then(
  "pattern_at\\({word}, point\\({float}, {float}, {float})) = {word}",
  function (
    varName: string,
    x: number,
    y: number,
    z: number,
    colorName: string,
  ) {
    const pattern = getPatternOrTextureMap(this, varName);
    const color = getColor(this, colorName);
    const point = new Point(x, y, z);

    expect(pattern.colorAt(point).equals(color)).to.be.true;
  },
);

Then(
  "pattern_at\\({word}, point\\({float}, {float}, {float})) = color\\({float}, {float}, {float})",
  function (
    varName: string,
    x: number,
    y: number,
    z: number,
    r: number,
    g: number,
    b: number,
  ) {
    const pattern = getXYZPattern(this, varName);
    const point = new Point(x, y, z);
    const color = new Color(r, g, b);

    expect(pattern.colorAt(point).equals(color)).to.be.true;
  },
);
